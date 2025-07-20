<template>
    <div class="flex flex-col items-center justify-center .height-screen">
       <div class="flex w-full p-4">
            <InputField type="date" @change="onChangeDate" v-model="startDate" label="Start Date" :max-date="past7Days.toISOString().split('T')[0]"/>
       </div>
        <div v-if="isLoading('get')" class="w-full max-w-sm flex justify-between items-end h-64 px-4">
            <div v-for="i in 7" :key="i" class="w-8 bg-blue-300/40 rounded animate-pulse"
                :style="{ height: `${Math.random() * 60 + 40}%` }"></div>
        </div>
        <div v-if="!isLoading('get')" class="max-w-sm">
            <BarChart :property="chartBarProperties" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BarChart from '@/components/charts/BarChart.vue';
import InputField from '@/components/formfields/InputField.vue';

const { chartBarProperties, getTranscation, chartBarMapping, isLoading, startDate, onChangeDate, past7Days } = useChart();
onMounted(async () => {
    await getTranscation();
    chartBarMapping();
});
</script>