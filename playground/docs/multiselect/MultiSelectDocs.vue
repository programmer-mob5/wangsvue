<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';
import Button from 'lib/components/button/Button.vue';

const model = ref<OptionValue[]>();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="MultiSelect" />
    </template>
    <template #content>
      <div
        class="w-[300px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-1">
          <MultiSelect
            v-model="model"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            :show-optional-text="false"
            label="Status"
            placeholder="Pilih status"
          />
          <MultiSelect
            v-model="model"
            :invalid="true"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            label="Status"
          />

          <Button @click="model = undefined" label="Empty Model" />
        </div>
      </div>

      <MultiSelect
        :options="['Waiting for Approval', 'Waiting for Handover']"
        controls
        label="Multi Select Controls"
      />
    </template>
  </Card>
</template>
