<!-- eslint-disable no-nested-ternary -->
<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import {
  TaskServices,
  ProjectProcessServices,
  TaskDependencyServices,
  ModuleServices,
  SubModuleServices,
} from 'wangsit-api-services';
import { TaskDependency, TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import {
  computed,
  ComputedRef,
  inject,
  nextTick,
  Ref,
  ref,
  shallowRef,
  watch,
} from 'vue';
import Button from 'lib/components/button/Button.vue';
import UserName from 'lib/components/username/UserName.vue';
import Badge from 'lib/components/badge/Badge.vue';
import InputAdditional from '../../common/InputAdditional.vue';
import { ProjectModule } from 'lib/types/projectModule.type';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import { cloneDeep } from 'lodash';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import DialogReportBug from 'lib/components/dialogreportbug/DialogReportBug.vue';
import { useLoadingStore } from 'lib/build-entry';
import { DetailTaskEmits } from 'lib/components/taskdetail/TaskDetail.vue.d';
import { DropdownOption } from 'lib/types/options.type';

const toast = useToast();
const { setLoading } = useLoadingStore();

const whitelistIframeTag = /<\s*\/?\s*(iframe)\b.*?>/;

const noSubModuleProcesses = [
  'Pengonsepan',
  'Diagram',
  'Wireframe',
  'Komponen Web',
  'Komponen Mobile',
  'Dokumentasi API',
  'User Manual Web',
  'User Manual Mobile',
  'Slicing Komponen Web',
  'Slicing Komponen Mobile',
  'Detailing',
];

const userLogin = JSON.parse(localStorage.getItem('user') as string) ?? {};

const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const projectId = inject<Ref<string>>('projectId');
const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');
const openDetailTask = inject<(taskIdParam: string) => void>('openDetailTask');
const isApproverHasAccess = inject<Ref<boolean>>('isApproverHasAccess');
const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const projectModules = ref<ProjectModule[]>();

const processDependencies = ref<TaskDependency[]>();
const taskDependencies = ref<TaskDependency[]>();
const dependencies = ref<TaskDependency[]>();

const loadingData = shallowRef<boolean>(false);
const dialogReportBug = shallowRef<boolean>(false);

const taskIdReportBug = shallowRef<string>();

const taskProcess = computed(() => taskDetail.value?.process ?? undefined);

/**
 * Checks if the task dependency input is disabled based on the task's status and user type.
 *
 * The task dependency input is disabled if the task is new
 *
 * the task is in the following statuses:
 * - 'Pending Review Leader'
 * - 'Selesai'
 * - 'Reported Bug'
 *
 * The user type is 'guest'.
 *
 * @returns {boolean}
 */
const isDisabled = computed(() => {
  return (
    isNewTask.value ||
    (
      ['Pending Review Leader', 'Selesai', 'Reported Bug'] as WangsitStatus[]
    ).includes(taskDetail.value?.status) ||
    (userType.value === 'guest' && !isApproverHasAccess.value)
  );
});

const customProcessOptions = computed(() =>
  processDependencies.value
    .filter((processDep) => {
      const isConcept = processDep.process.name === 'Pengonsepan';
      const isComponent = [
        'Komponen Web',
        'Komponen Mobile',
        'Slicing Komponen Web',
        'Slicing Komponen Mobile',
      ].includes(processDep.process.name);
      return !isConcept && !isComponent;
    })
    .map((processDep) => ({
      label: processDep.process.name,
      value: processDep.process,
    })),
);

const getTaskOptions = async (args: {
  index: number;
  processId: string;
  moduleId: string;
  subModuleId?: string;
}): Promise<void> => {
  if (
    dependencies.value[args.index] &&
    dependencies.value[args.index]?.subModuleVisibility &&
    !dependencies.value[args.index]?.subModule
  )
    return;
  try {
    dependencies.value[args.index].loading = true;

    const params = {
      project: JSON.stringify([projectId.value]),
      process: JSON.stringify([args.processId]),
      module: JSON.stringify([args.moduleId]),
      subModule: args.subModuleId
        ? JSON.stringify([args.subModuleId])
        : undefined,
      taskOptions: true,
    };
    const { data: response } = await TaskServices.getTaskOptions(params);
    if (response) {
      dependencies.value[args.index].options = response.data
        .taskOptions as DropdownOption[];
    }
  } catch (error) {
    toast.add({
      message: 'Opsi untuk task gagal dimuat.',
      error,
    });
  } finally {
    if (dependencies.value[args.index]) {
      dependencies.value[args.index].loading = false;
    }
  }
};

/**
 * Asynchronously loads and processes task dependencies, project modules, and process dependencies.
 *
 * This function performs the following:
 * - Sets the loading state to true.
 * - Fetches project modules, process dependencies, and task dependencies.
 * - Merges process and task dependencies, ensuring all dependencies are accounted for.
 * - Updates the `dependencies` ref with deep-cloned merged dependencies.
 * - Loads custom module options if there are custom dependencies present.
 */
const loadData = async (): Promise<void> => {
  try {
    loadingData.value = true;

    // Fetch project modules
    projectModules.value = await getProjectModules();

    // Fetch process dependencies and task dependencies
    processDependencies.value = await getProcessDependencies();
    taskDependencies.value = await getTaskDependencies();

    // Merge process and task dependencies
    const mergedDependencies = processDependencies.value?.map((process) => {
      // Find the corresponding task from taskDependencies based on process id
      const taskData = taskDependencies.value?.find(
        (task) =>
          task?.process?._id === process?.process?._id &&
          task?.module?._id === process?.module?._id,
      );

      if (taskData) {
        // Find the current dependency in dependencies based on process id and module id
        const currentDependency = dependencies.value?.find(
          (dep) =>
            dep?.process?._id === taskData?.process?._id &&
            dep?.module?._id === taskData?.module?._id,
        );

        /*
         * If the current dependency is found, use its options as task options
         * Otherwise, create a new dependency with the task options and selected options
         */
        return {
          ...process,
          task: taskData.task,
          options: currentDependency
            ? currentDependency.options
            : taskData.task.map((task) => ({
                label: task.name,
                value: task._id,
              })),
          selectedOptions: taskData.task.map((task) => task._id),
          subModuleVisibility: !!taskData.subModule,
          subModule: taskData?.subModule ?? process.subModule,
          subModuleOptions: taskData?.subModule
            ? [
                {
                  label: taskData?.subModule?.name,
                  value: taskData?.subModule,
                },
              ]
            : [],
        };
      }
      // If the task data is not found, return the process dependency
      return {
        ...process,
        subModuleVisibility: !noSubModuleProcesses.includes(
          process.process.name,
        ),
        subModule: !noSubModuleProcesses.includes(process.process.name)
          ? process.subModule
          : undefined,
      };
    });

    // Iterate through taskDependencies and add new processes that don't exist in processDependencies
    taskDependencies.value?.forEach((task) => {
      const processExists = mergedDependencies.some(
        (process) =>
          process?.process?._id === task?.process?._id &&
          process?.module?._id === task?.module?._id,
      );

      if (!processExists) {
        // Find the current dependency in dependencies based on process id and module id
        const currentDependency = dependencies.value?.find(
          (dep) =>
            dep?.process?._id === task?.process?._id &&
            dep?.module?._id === task?.module?._id,
        );

        // Add a new process dependency with the task options and selected options
        mergedDependencies.push({
          process: { _id: task.process?._id, name: task.process?.name },
          processOptions: customProcessOptions.value,
          module: { _id: task.module?._id, name: task.module?.name },
          moduleOptions: [
            {
              label: task.module?.name,
              value: { _id: task.module?._id, name: task.module?.name },
            },
          ],
          subModule: task.subModule
            ? { _id: task.subModule?._id, name: task.subModule?.name }
            : undefined,
          subModuleOptions: task.subModule
            ? [
                {
                  label: task.subModule?.name,
                  value: {
                    _id: task.subModule?._id,
                    name: task.subModule?.name,
                  },
                },
              ]
            : undefined,
          subModuleVisibility: !!task.subModule,
          task: task.task,
          // If the current dependency is found, use its options as task options
          options: currentDependency
            ? currentDependency.options
            : task.task.map((t) => ({ label: t.name, value: t._id })),
          selectedOptions: task.task.map((t) => t._id),
          loading: false,
          custom: true,
        });
      }
    });

    // Update the dependencies ref with the merged dependencies
    dependencies.value = cloneDeep(mergedDependencies);

    // Wait for Vue's DOM updates to finish
    await nextTick();
  } catch (error) {
    console.error(error);
  } finally {
    loadingData.value = false;
  }
};

const getProcessDependencies = async (): Promise<TaskDependency[]> => {
  try {
    const { data: response } = await ProjectProcessServices.getProcessList(
      projectId.value,
      { name: JSON.stringify([taskDetail?.value?.process.name]) },
      'active',
    );
    if (response) {
      const conceptModule = projectModules.value?.find(
        (module) => module.name === 'Konsep',
      );
      const componentModule = projectModules.value?.find(
        (module) => module.name === 'Komponen',
      );
      const getModule = (processName: string): ProjectModule => {
        if (processName === 'Pengonsepan') return conceptModule;
        if (
          [
            'Komponen Web',
            'Komponen Mobile',
            'Slicing Komponen Web',
            'Slicing Komponen Mobile',
          ].includes(processName)
        )
          return componentModule;
        return taskDetail.value?.module;
      };
      return response?.data?.processProjects?.[0]?.dependencies?.map(
        (dep: { name: string; _id: string }) => ({
          process: dep,
          module:
            /*
             * If the process name is "Pengonsepan", use the conceptModule.
             * If the process name is one of the following, use the componentModule.
             * Otherwise, use the module of the current task.
             * This is because the dependency process will have a different module
             * depending on the process name.
             */
            getModule(dep.name),
          subModule: taskDetail.value?.subModule,
          task: [],
          options: [],
          loading: false,
        }),
      );
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Proses dependensi gagal dimuat.',
      error,
    });
    return undefined;
  }
};

const getTaskDependencies = async (): Promise<TaskDependency[]> => {
  try {
    if (!taskId.value) return;

    const { data } = await TaskDependencyServices.getTaskDependencies(
      taskId.value,
    );

    if (data) {
      return data.data;
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Task dependensi gagal dimuat.',
      error,
    });
    return undefined;
  }
};

const getProjectModules = async (): Promise<ProjectModule[]> => {
  try {
    const { data } = await ModuleServices.getModuleList(projectId.value, {
      hasNoRestriction: true,
    });
    if (data) {
      return data.data;
    }
    return undefined;
  } catch (error) {
    toast.add({
      message: 'Projek modul gagal dimuat.',
      error,
    });
    return undefined;
  }
};

const sendDependencyData = async (): Promise<boolean> => {
  try {
    const body = {
      data: dependencies.value.flatMap((item) =>
        item.selectedOptions
          ? item.selectedOptions.map((option) => {
              const taskIndex = item.task?.findIndex(
                (task) => task._id === option,
              );
              const caption =
                typeof taskIndex === 'number' && taskIndex !== -1
                  ? item.task[taskIndex].caption
                  : undefined;
              return {
                task: option,
                custom: item.custom,
                caption: caption,
              };
            })
          : [],
      ),
    };
    const { data } = await TaskDependencyServices.updateTaskDependencies(
      taskId.value,
      body,
    );
    if (data) {
      return true;
    }
    return false;
  } catch (error) {
    toast.add({
      message: 'Gagal mengirim data dependensi.',
      error,
    });
    return false;
  }
};

/**
 * Remove custom dependency if the selected options is empty.
 * @param {number} depIndex - Dependency index to be removed.
 */
const handleEmptyCustomDependency = (depIndex: number): void => {
  const dependency = dependencies.value[depIndex];
  if (dependency.custom && !dependency.selectedOptions?.length) {
    dependencies.value.splice(depIndex, 1);
  }
};

/**
 * Update task dependency based on the selected options.
 *
 * @returns {Promise<boolean>} Whether the update was successful or not.
 */
const updateTaskDependency = async (depIndex: number): Promise<boolean> => {
  /*
   * We don't want to perform update if the data is still being loaded
   * because the dependencies might not be up to date yet.
   */
  const dependency = dependencies.value[depIndex];
  if (
    loadingData.value ||
    !dependency?.process ||
    !dependency?.module ||
    (dependency.subModuleVisibility && !dependency.subModule)
  )
    return false;
  try {
    handleEmptyCustomDependency(depIndex);
    const isDataSent = await sendDependencyData();
    if (isDataSent) {
      await loadData();
      reloadTask();
      return true;
    }
    return false;
  } catch (error) {
    toast.add({
      message: 'Task dependensi gagal diubah.',
      error,
    });
    return false;
  }
};

/**
 * Update the caption of a task dependency.
 *
 * @param args - An object containing the caption to update, the index of the task, and the index of the dependency.
 * @param args.caption - The new caption to set.
 * @param args.taskIndex - The index of the task to update.
 * @param args.depIndex - The index of the dependency to update.
 * @returns A promise that resolves once the caption is updated.
 */
const updateTaskDependencyCaption = async (args: {
  caption: string;
  taskIndex: number;
  depIndex: number;
}): Promise<void> => {
  try {
    dependencies.value[args.depIndex].task[args.taskIndex].caption =
      args.caption;

    const isUpdated = await updateTaskDependency(args.depIndex);
    if (isUpdated) {
      dependencies.value[args.depIndex].task[args.taskIndex].showCaption =
        false;
    }
  } catch (error) {
    console.error(error);
  }
};

const addCustomDependency = (type: string): void => {
  if (type === 'one-way') {
    dependencies.value.push({
      process: undefined,
      module: undefined,
      subModule: undefined,
      task: [],
      options: [],
      loading: false,
      custom: true,
      processOptions: customProcessOptions.value,
    });
  }
};

/**
 * This function will show or hide submodule based on the process selection.
 * If the process name is inside `noSubModuleProcesses` submodule will be hidden.
 * Otherwise, submodule will be shown.
 */
const showSubModuleByProcess = (depIndex: number): void => {
  const haveNoSubModule = noSubModuleProcesses.includes(
    dependencies.value[depIndex].process.name,
  );
  dependencies.value[depIndex].subModuleVisibility = !haveNoSubModule;
  if (haveNoSubModule) {
    dependencies.value[depIndex].subModule = undefined;
  }
};

const getCustomModuleOptions = async (depIndex: number): Promise<void> => {
  try {
    const modules = await getProjectModules();

    dependencies.value[depIndex].moduleOptions = modules
      ? modules
          .filter((module) => {
            const isDuplicateModule = dependencies.value.some(
              (dep, i) =>
                dep.process?._id === dependencies.value[depIndex].process._id &&
                dep.module?._id === module._id &&
                !dep.subModuleVisibility &&
                i !== depIndex,
            );
            const isExcludedModule = ['Komponen', 'Konsep'].includes(
              module.name,
            );
            const isCurrentTaskModule =
              module._id === taskDetail.value.module._id;
            return (
              !isExcludedModule && !isCurrentTaskModule && !isDuplicateModule
            );
          })
          .map((module) => ({
            label: module.name,
            value: {
              _id: module._id,
              name: module.name,
            },
          }))
      : [];
  } catch (error) {
    toast.add({
      message: 'Data modul gagal dimuat.',
      severity: 'error',
      error,
    });
  }
};

const getCustomSubmoduleOptions = async (depIndex: number): Promise<void> => {
  const currentModule = dependencies.value[depIndex].module;
  if (!currentModule) return;
  try {
    const { data: response } = await SubModuleServices.getSubmoduleList(
      projectId.value,
      {
        module: JSON.stringify([currentModule._id]),
      },
    );
    if (response.data) {
      const subModules = response.data.data;
      /*
       * Filter out submodules that are already used in other dependencies
       * with the same process and module
       */
      const subModulesWithoutDuplicates = subModules.filter((subModule) => {
        const similarSubModule = dependencies.value.find(
          (dep, i) =>
            dep.process?._id === dependencies.value[depIndex].process._id &&
            dep.module?._id === dependencies.value[depIndex].module._id &&
            dep.subModule?._id === subModule?._id &&
            i !== depIndex,
        );
        return !similarSubModule;
      });

      // Map the filtered submodules to the correct format
      dependencies.value[depIndex].subModuleOptions =
        subModulesWithoutDuplicates.map((subModule) => ({
          label: subModule.name,
          value: {
            _id: subModule._id,
            name: subModule.name,
          },
        }));
    }
  } catch (error) {
    toast.add({
      message: 'Data sub modul gagal dimuat.',
      error,
    });
  }
};

const onProcessChange = (depIndex: number): void => {
  showSubModuleByProcess(depIndex);
  resetField(depIndex, 'module');
  resetField(depIndex, 'subModule');
  resetField(depIndex, 'selectedOptions');
  resetField(depIndex, 'task');
};

const onModuleChange = (depIndex: number): void => {
  resetField(depIndex, 'subModule');
  resetField(depIndex, 'selectedOptions');
  resetField(depIndex, 'task');
};

const onSubModuleChange = async (depIndex: number): Promise<void> => {
  try {
    /*
     * Set loadingData ref into true,
     * To prevents triggering the updateTaskDependency method
     */
    loadingData.value = true;

    resetField(depIndex, 'selectedOptions');
    resetField(depIndex, 'task');

    // Wait for Vue's DOM updates to finish
    await nextTick();
  } catch (error) {
    console.error(error);
  } finally {
    loadingData.value = false;
  }
};

const resetField = (
  depIndex: number,
  field: 'module' | 'subModule' | 'selectedOptions' | 'task',
): void => {
  dependencies.value[depIndex][field] = undefined;
};

const removeCustomDependency = async (depIndex: number): Promise<void> => {
  try {
    if (dependencies.value[depIndex].custom) {
      dependencies.value.splice(depIndex, 1);
      const isDataSent = await sendDependencyData();
      if (isDataSent) {
        await loadData();
        reloadTask();
      }
    }
  } catch (error) {
    toast.add({
      message: 'Task dependensi gagal dihapus.',
      error,
    });
  }
};

const reportBugTask = async (note?: string): Promise<void> => {
  try {
    setLoading(true);
    const { data } = await TaskServices.reportBugTask(taskIdReportBug.value, {
      note: note,
    });
    if (data) {
      toast.add({
        message: 'Task telah direport bug.',
        severity: 'success',
      });
      dialogReportBug.value = false;
      reloadTask();
    }
  } catch (error) {
    toast.add({
      message: 'Task gagal direport bug.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const reloadTask = (): void => {
  refreshTaskHandler('update', taskId.value);
};

const openDialogReportBug = (id: string): void => {
  taskIdReportBug.value = id;
  dialogReportBug.value = true;
};

watch(
  taskProcess,
  (value, oldValue) => {
    if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
      loadData();
    }
  },
  { immediate: true },
);
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <div v-if="dependencies?.length" data-wv-section="detailtask-task-dependency">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="link" />
        <div class="text-xs font-semibold">Task Dependensi</div>
      </div>
      <Button
        :disabled="isDisabled"
        @click="addCustomDependency('one-way')"
        icon="add"
        label="Custom"
        severity="secondary"
      />
    </div>
    <div class="pl-8 flex flex-col gap-2">
      <div :key="index" v-for="(dep, index) in dependencies" class="">
        <div class="flex gap-2">
          <div class="flex items-center gap-1">
            <span class="text-xs font-semibold">Proses: </span>
            <Dropdown
              v-if="dep.custom"
              v-model="dep.process"
              :disabled="isDisabled"
              :initial-value="dep.process"
              :options="customProcessOptions"
              @update:model-value="onProcessChange(index)"
              class="!w-[110px]"
              data-key="name"
              option-label="label"
              option-value="value"
              placeholder="Pilih proses"
              use-validator
            />
            <span v-else>{{ dep.process?.name }}</span>
          </div>
          <div v-if="dep.process" class="flex items-center gap-1">
            <span class="text-xs font-semibold">Modul: </span>
            <Dropdown
              v-if="dep.custom"
              v-model="dep.module"
              :disabled="isDisabled"
              :initial-value="dep.module"
              :options="dep.moduleOptions"
              @show="getCustomModuleOptions(index)"
              @update:model-value="onModuleChange(index)"
              class="!w-[110px]"
              data-key="name"
              option-label="label"
              option-value="value"
              placeholder="Pilih modul"
              use-validator
            />
            <span v-else>{{ dep.module?.name }}</span>
          </div>
          <div v-if="dep.subModuleVisibility" class="flex items-center gap-1">
            <span class="text-xs font-semibold">Sub Modul: </span>
            <Dropdown
              v-if="
                dep.custom ||
                noSubModuleProcesses.includes(taskDetail.process.name)
              "
              v-model="dep.subModule"
              :disabled="isDisabled"
              :initial-value="dep.subModule"
              :options="dep.subModuleOptions"
              @show="getCustomSubmoduleOptions(index)"
              @update:model-value="onSubModuleChange(index)"
              class="!w-[110px]"
              data-key="name"
              option-label="label"
              option-value="value"
              placeholder="Pilih sub modul"
              use-validator
            />
            <span v-else>{{ dep.subModule?.name }}</span>
          </div>
          <div
            v-if="dep.subModuleVisibility ? dep.subModule : dep.module"
            class="flex items-center gap-1"
          >
            <span class="text-xs font-semibold">Task: </span>
            <MultiSelect
              v-model="dep.selectedOptions"
              :disabled="isDisabled"
              :initial-value="dep.selectedOptions"
              :loading="dep.loading"
              :options="dep.options"
              @show="
                getTaskOptions({
                  index: index,
                  processId: dep.process._id,
                  moduleId: dep.module._id,
                  subModuleId: dep.subModule?._id,
                })
              "
              @update:model-value="updateTaskDependency(index)"
              class="!w-[110px]"
              option-label="label"
              option-value="value"
              placeholder="Pilih task"
              use-validator
            />
          </div>
          <Button
            v-if="dep.custom"
            :disabled="isDisabled"
            @click="removeCustomDependency(index)"
            class="text-danger-500"
            icon="close"
            severity="danger"
            text
          />
        </div>
        <ul class="list-none pt-2">
          <li
            :key="taskIndex"
            v-for="(task, taskIndex) in dep.task"
            class="flex pt-1 pb-1 first:!pt-0 first:!pb-1 last:!pt-1 last:!pb-0 before:content-['•'] before:mr-2 before:mt-1.5"
          >
            <div class="w-full flex flex-col gap-1.5 overflow-auto">
              <div class="flex justify-between w-full">
                <div class="flex items-center gap-2">
                  <span
                    @click="openDetailTask(task._id)"
                    class="cursor-pointer"
                  >
                    {{ task.name }}
                  </span>
                  <div v-if="task.assignedTo?.length" class="flex gap-2">
                    <UserName
                      :key="userIndex"
                      v-for="(user, userIndex) in task.assignedTo"
                      :user="user"
                      type="icon"
                    />
                  </div>
                  <Badge :label="task.status" format="nowrap" />
                  <Button
                    v-if="
                      task.status === 'Selesai' &&
                      task.assignedTo?.find(
                        (member) => member._id !== userLogin._id,
                      )
                    "
                    :disabled="isDisabled"
                    @click="openDialogReportBug(task._id)"
                    label="Report Bug"
                    severity="danger"
                    text
                  />
                </div>
                <Button
                  :disabled="isDisabled"
                  @click="task.showCaption = !task.showCaption"
                  icon="chat-new-line"
                  severity="secondary"
                  text
                />
              </div>
              <div v-if="task.taskLink" class="">
                <a
                  v-if="task.taskLink.linkType === 'url'"
                  :href="task.taskLink.link"
                  class="text-link"
                  target="_blank"
                >
                  {{ task.taskLink.link }}
                </a>
                <template v-else-if="task.taskLink.linkType === 'embedded'">
                  <div
                    v-if="whitelistIframeTag.test(task.taskLink.link)"
                    v-html="task.taskLink.link"
                    class="[&_iframe]:flex-grow flex w-full h-full"
                  />
                  <div v-else>
                    <span class="font-bold text-lg">
                      Oh Tidak! kode embed tidak valid.
                    </span>
                  </div>
                </template>
              </div>
              <div v-if="task.showCaption || task.caption?.length">
                <InputAdditional
                  v-if="task.showCaption"
                  :value="task.caption"
                  @cancel="task.showCaption = false"
                  @submit="
                    updateTaskDependencyCaption({
                      caption: $event,
                      taskIndex: taskIndex,
                      depIndex: index,
                    })
                  "
                  placeholder="Tulis caption"
                />
                <span v-else class="text-xs text-grayscale-700">{{
                  task.caption
                }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <DialogReportBug v-model:visible="dialogReportBug" @submit="reportBugTask" />
</template>
