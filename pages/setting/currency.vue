<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="section-title">Available Currencies</h2>
            <span class="text-xs text-slate-500">{{ currencies.length }} currencies</span>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-2">
            <div v-for="item in 3" :key="item" class="surface-card-muted flex items-center justify-between p-4 animate-pulse">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-xl bg-slate-200"></div>
                    <div class="h-5 w-16 rounded-full bg-slate-200"></div>
                </div>
                <div class="h-5 w-8 rounded-full bg-slate-200"></div>
            </div>
        </div>

        <!-- Currency List -->
        <div v-else class="space-y-2">
            <div
                v-for="currency in currencies"
                :key="currency.code"
                class="surface-card-muted flex items-center justify-between p-4 transition-colors hover:bg-slate-50">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <span class="text-lg font-bold text-blue-700">{{ currency.symbol }}</span>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-900">{{ currency.code }}</p>
                        <p class="text-xs text-slate-500">Currency</p>
                    </div>
                </div>
                <div class="rounded-lg bg-slate-100 px-3 py-1">
                    <span class="text-sm font-medium text-slate-700">{{ currency.symbol }}</span>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && currencies.length === 0" class="text-center py-8">
            <p class="text-sm text-slate-500">No currencies available</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { currencies, getCurrency, isLoading } = useCurrency();

onMounted(() => {
    getCurrency();
});
</script>
