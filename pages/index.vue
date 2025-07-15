<template>
    <div class="flex justify-center .height-screen">
        <div v-if="isLoading" class="w-full max-w-sm flex justify-between items-end h-64 px-4">
            <div v-for="i in 7" :key="i" class="w-8 bg-blue-300/40 rounded animate-pulse"
                :style="{ height: `${Math.random() * 60 + 40}%` }"></div>
        </div>
        <div v-if="!isLoading" class="max-w-sm">
            <BarChart :property="chartBarProperties" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BarChart from '~/components/charts/BarChart.vue';

const { chartBarProperties, getTranscation, chartBarMapping, isLoading } = useChart();
onMounted(async () => {
    await getTranscation();
    chartBarMapping();
});
</script>