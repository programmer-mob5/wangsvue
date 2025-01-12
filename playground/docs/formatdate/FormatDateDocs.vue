<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import {
  formatDate,
  TDateFormat,
  TTimeFormat,
  formatISODate,
} from 'lib/utils/date.util';

const formatExamples: {
  dateFormat: TDateFormat;
  description: string;
  timeFormat?: TTimeFormat;
}[] = [
  {
    dateFormat: 'd/m/yy',
    timeFormat: 'HH:mm',
    description:
      'Day without leading zero/Month without leading zero/Two-digit Year with Time (d/m/yy HH:mm)',
  },
  {
    dateFormat: 'd/mm/yy',
    timeFormat: 'HH:mm:ss',
    description:
      'Day without leading zero/Two-digit Month/Two-digit Year and Full Time (d/mm/yy HH:mm:ss)',
  },
  {
    dateFormat: 'dd/mm/yy',
    timeFormat: 'HH:mm:ss a',
    description:
      'Two-digit Day/Two-digit Month/Two-digit Year with AM/PM (dd/mm/yy HH:mm:ss a)',
  },
  {
    dateFormat: 'dd/mm/yyyy',
    description: 'Two-digit Day/Two-digit Month/Four-digit Year (dd/mm/yyyy)',
  },
  {
    dateFormat: 'dd M yy',
    description: 'Two-digit Day/Short Month/Two-digit Year (dd M yy)',
  },
  {
    dateFormat: 'dd M yyyy',
    description: 'Two-digit Day/Short Month/Four-digit Year (dd M yyyy)',
  },
  {
    dateFormat: 'dd MM yy',
    description: 'Two-digit Day/Full Month/Two-digit Year (dd MM yy)',
  },
  {
    dateFormat: 'dd MM yyyy',
    description: 'Two-digit Day/Full Month/Four-digit Year (dd MM yyyy)',
  },
  {
    dateFormat: 'D dd M yy',
    description:
      'Short Day Name Two-digit Day/Short Month/Two-digit Year (D, dd M yy)',
  },
  {
    dateFormat: 'D dd M yyyy',
    description:
      'Short Day Name Two-digit Day/Short Month/Four-digit Year (D, dd M yyyy)',
  },
  {
    dateFormat: 'DD dd MM yy',
    description:
      'Full Day Name Two-digit Day/Full Month/Two-digit Year (DD, dd MM yy)',
  },
  {
    dateFormat: 'DD dd MM yyyy',
    description:
      'Full Day Name Two-digit Day/Full Month/Four-digit Year (DD, dd MM yyyy)',
  },
  {
    dateFormat: 'D, dd M yy',
    description:
      'Short Day Name, Two-digit Day/Short Month/Two-digit Year (D, dd M yy)',
  },
  {
    dateFormat: 'D, dd M yyyy',
    description:
      'Short Day Name, Two-digit Day/Short Month/Four-digit Year (D, dd M yyyy)',
  },
  {
    dateFormat: 'DD, dd MM yy',
    description:
      'Full Day Name, Two-digit Day/Full Month/Two-digit Year (DD, dd MM yy)',
  },
  {
    dateFormat: 'DD, dd MM yyyy',
    description:
      'Full Day Name, Two-digit Day/Full Month/Four-digit Year (DD, dd MM yyyy)',
  },
];
</script>

<template>
  <Card>
    <template #header>
      <DocTitle category="UTILS" name="Format Date" />
    </template>
    <template #content>
      <div
        :key="format.dateFormat"
        v-for="(format, index) in formatExamples"
        class="flex flex-col gap-3"
      >
        <span class="font-semibold text-sm">{{ format.description }}</span>
        <span>
          {{ formatDate(new Date('04/08/2024 13:45:55'), format) }}
        </span>
        <br />
        <template v-if="index === formatExamples.length - 1">
          <span class="font-semibold text-sm">
            No Custom Format (Default Wangsit)
          </span>
          <span>
            {{ formatISODate(new Date()) }}
          </span>
        </template>
      </div>
    </template>
  </Card>
</template>
