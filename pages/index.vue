<template>
    <div class="page-shell">
        <section class="mb-6">
            <p class="section-title mb-2">Overview</p>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-2xl">
                    <h1 class="text-3xl font-semibold text-slate-900">Weekly balance</h1>
                    <p class="mt-1 text-sm text-slate-500">Review the last 7 days in one place.</p>
                    <div class="mt-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                        {{ selectedRangeLabel }}
                    </div>
                </div>

                <div class="w-full max-w-xl">
                    <div class="surface-card-muted space-y-4 p-4">
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="preset in rangePresets"
                                :key="preset.id"
                                type="button"
                                class="rounded-full border px-4 py-2 text-sm font-medium transition"
                                :class="selectedPreset === preset.id    
                                    ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'"
                                @click="applyPreset(preset.id)">
                                {{ preset.label }}
                            </button>
                        </div>
                    </div>
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

        <div v-else class="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2 lg:items-start">
            <PieChart :property="chartPieProperties" />
            <BarChart :property="chartBarProperties" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';

const {
    applyPreset,
    chartBarProperties,
    chartPieProperties,
    getTransaction,
    chartBarMapping,
    chartPieMapping,
    isLoading,
    rangePresets,
    selectedPreset,
    selectedRangeLabel,
} = useChart();
onMounted(async () => {
    await getTransaction();
    chartBarMapping();
    chartPieMapping();
});
</script>
