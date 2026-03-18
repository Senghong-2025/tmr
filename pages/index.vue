<template>
    <div class="page-shell">
        <section class="mb-6">
            <p class="section-title mb-2">Overview</p>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900">Weekly balance</h1>
                    <p class="mt-1 text-sm text-slate-500">Review the last 7 days in one place.</p>
                </div>
                <div class="w-full sm:max-w-xs">
                    <InputField type="date" @change="onChangeDate" v-model="startDate" label="Start date"
                        :max-date="past7Days.toISOString().split('T')[0]" />
                </div>
            </div>
        </section>

        <div v-if="isLoading('get')" class="surface-card w-full p-6">
            <div class="mb-6 h-5 w-40 animate-pulse rounded-full bg-slate-200"></div>
            <div class="flex h-64 items-end justify-between gap-3">
                <div v-for="i in 7" :key="i" class="w-full rounded-xl bg-blue-100 animate-pulse"
                    :style="{ height: `${Math.random() * 60 + 40}%` }"></div>
            </div>
        </div>

        <div v-else class="mx-auto w-full max-w-4xl">
            <BarChart :property="chartBarProperties" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BarChart from '@/components/charts/BarChart.vue';
import InputField from '@/components/formfields/InputField.vue';

const { chartBarProperties, getTransaction, chartBarMapping, isLoading, startDate, onChangeDate, past7Days } = useChart();
onMounted(async () => {
    await getTransaction();
    chartBarMapping();
});
</script>
