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
      label: 'Expense',
      backgroundColor: '#ffd733',
      data: [...props.property.data],
      hoverBackgroundColor: '#ecff33'
    }
  ]
}))

// Chart options with proper typing
const chartOptions: ChartOptions<ChartType> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#ffffff'
      }
    },
    title: {
      display: true,
      text: 'Past 7 Days Expenses',
      color: '#ffffff'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed.y;
          return `${value} $`;
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
      ticks: {
        color: '#FFFFFF',
        callback: (value) => value + " $",
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)' 
      }
    }
  }
}
</script>
