<script setup lang="ts">
import { computed, inject, Ref, shallowRef } from 'vue';

import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import { useToast } from 'lib/utils';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { EditTaskDTO } from 'lib/dto/task.dto';
import { TaskServices } from 'wangsit-api-services';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import { DetailTaskEmits } from '../../TaskDetail.vue.d';

const taskId = inject<Ref<string>>('taskId');
const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const { setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  priorityValue?: number;
}>();

const priorityValueInvalid = shallowRef<boolean>(false);
const inputKey = shallowRef<number>(0);
const inputValue = shallowRef<number>(0);

const validatorMessage = computed(() => {
  return inputValue.value
    ? 'Nilai prioritas sudah ada'
    : 'Nilai prioritas tidak boleh kosong';
});

const handleSubmit = async (e: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    const body: EditTaskDTO = {
      priority: e.formValues?.priorityValue as unknown as number,
    };

    const { data } = await TaskServices.putEditTask(taskId.value, body);

    if (data) {
      toast.add({
        message: 'Nilai prioritas telah disimpan.',
        severity: 'success',
      });

      refreshTaskHandler('update', taskId.value);

      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message: 'Nilai prioritas gagal disimpan.',
      error,
    });
    if (error.response?.status === 400) {
      priorityValueInvalid.value = true;
      const el = document.querySelector(
        '#tambah-nilai-prioritas-inputnumber',
      ) as HTMLElement;
      el?.blur();
    }
  } finally {
    setLoading(false);
  }
};

const onInput = (value: number): void => {
  inputValue.value = value;
  if (value) {
    priorityValueInvalid.value = false;
  } else {
    priorityValueInvalid.value = true;
  }
};
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :reset-after-submit="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @hide="priorityValueInvalid = false"
    @submit="handleSubmit"
    data-wv-name="dialog-priority-value"
    header="Nilai Prioritas"
  >
    <template #fields>
      <InputNumber
        :key="inputKey"
        :invalid="priorityValueInvalid"
        :max="9999"
        :max-digit="4"
        :min="0"
        :validator-message="validatorMessage"
        :value="props.priorityValue"
        @input="onInput"
        class="!w-full"
        field-name="priorityValue"
        label="Tambah Nilai Prioritas"
        mandatory
        placeholder="0"
        use-validator
      />
    </template>
  </DialogForm>
</template>
