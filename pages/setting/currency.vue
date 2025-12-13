<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Available Currencies</h2>
            <span class="text-xs text-gray-500">{{ currencies.length }} currencies</span>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-2">
            <div v-for="item in 3" :key="item" class="flex items-center justify-between p-4 bg-gray-700/20 rounded-xl animate-pulse">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-600/50 rounded-xl"></div>
                    <div class="h-5 bg-gray-600/50 rounded-full w-16"></div>
                </div>
                <div class="h-5 bg-gray-600/50 rounded-full w-8"></div>
            </div>
        </div>

        <!-- Currency List -->
        <div v-else class="space-y-2">
            <div
                v-for="currency in currencies"
                :key="currency.code"
                class="flex items-center justify-between p-4 bg-gray-700/20 rounded-xl hover:bg-gray-700/30 transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <span class="text-lg font-bold text-emerald-400">{{ currency.symbol }}</span>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-100">{{ currency.code }}</p>
                        <p class="text-xs text-gray-500">Currency</p>
                    </div>
                </div>
                <div class="px-3 py-1 bg-gray-600/30 rounded-lg">
                    <span class="text-sm font-medium text-gray-300">{{ currency.symbol }}</span>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && currencies.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-sm">No currencies available</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { currencies, getCurrency, isLoading } = useCurrency();

onMounted(() => {
    getCurrency();
});
</script>
