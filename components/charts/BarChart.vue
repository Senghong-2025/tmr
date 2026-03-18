<template>
  <div class="surface-card p-4 sm:p-6">
    <Bar :data="chartData" :options="chartOptions" :height="320" />
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  property: IBarChart,
}>();
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { IBarChart } from '~/models/chart';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
type ChartType = 'bar'

const chartData = computed<ChartData<ChartType>>(() => ({
  labels: [...props.property.label],
  datasets: [
    {
      label: 'Balance',
      backgroundColor: props.property.data.map(value => value >= 0 ? '#10b981' : '#ef4444'),
      data: props.property.data.map(value => Math.abs(value)),
      hoverBackgroundColor: props.property.data.map(value => value >= 0 ? '#34d399' : '#f87171'),
      borderRadius: 6,
      borderSkipped: false,
    }
  ]
}))

// Chart options with proper typing
const chartOptions = computed<ChartOptions<ChartType>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#475569'
      }
    },
    title: {
      display: true,
      text: 'Past 7 Days Balance',
      color: '#0f172a'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const originalValue = props.property.data[context.dataIndex];
          const sign = originalValue >= 0 ? '+' : '';
          return `${sign}${originalValue.toFixed(2)} $`;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#64748b'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.2)'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#64748b',
        callback: (value) => `${value} $`,
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.2)',
      }
    }
  }
}))
</script>
