<template>
  <div class="surface-card p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-slate-900">Spending by category</h2>
      <p class="mt-1 text-sm text-slate-500">Outcome transactions for the selected 7-day range.</p>
    </div>

    <div v-if="hasData" class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(200px,0.9fr)] lg:items-center">
      <div class="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
        <Pie :data="chartData" :options="chartOptions" :height="220" />
      </div>

      <div class="space-y-3">
        <div
          v-for="(label, index) in props.property.label"
          :key="label"
          class="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="h-3 w-3 shrink-0 rounded-full"
              :style="{ backgroundColor: backgroundColors[index] }"
            />
            <span class="truncate text-sm font-medium text-slate-700">{{ label }}</span>
          </div>
          <span class="text-sm font-semibold text-slate-900" :style="blurStyle">${{ props.property.data[index].toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <div>
        <p class="text-base font-semibold text-slate-800">No expense data</p>
        <p class="mt-1 text-sm text-slate-500">Add outcome transactions in this date range to see the category split.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Pie } from 'vue-chartjs';
import type { IPieChart } from '~/models/chart';
import usePrivacy from '~/composables/usePrivacy';

const props = defineProps<{
  property: IPieChart,
}>();

ChartJS.register(ArcElement, Tooltip, Legend);
const { blurStyle, loadSettings } = usePrivacy();

onMounted(() => {
  loadSettings();
});

const palette = ['#0f766e', '#ea580c', '#2563eb', '#ca8a04', '#dc2626', '#7c3aed', '#0891b2', '#4f46e5'];

const backgroundColors = computed(() =>
  props.property.label.map((_, index) => palette[index % palette.length])
);

const hasData = computed(() => props.property.data.some((value) => value > 0));

const chartData = computed<ChartData<'pie'>>(() => ({
  labels: [...props.property.label],
  datasets: [
    {
      data: [...props.property.data],
      backgroundColor: backgroundColors.value,
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 10,
    },
  ],
}));

const chartOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(context) {
          const value = Number(context.raw ?? 0);
          const total = props.property.data.reduce((sum, item) => sum + item, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
          return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
        },
      },
    },
  },
}));
</script>
