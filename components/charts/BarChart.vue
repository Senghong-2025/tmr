<template>
  <Bar :data="chartData" :options="chartOptions" :height="400" :width="400" />
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
        color: '#ffffff'
      }
    },
    title: {
      display: true,
      text: 'Past 7 Days Balance',
      color: '#ffffff'
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
        color: '#FFFFFF'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#FFFFFF',
        callback: (value) => `${value} $`,
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      }
    }
  }
}))
</script>
