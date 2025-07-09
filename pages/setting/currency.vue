<template>
    <div class="app-grid">
        <div v-if="isLoading" v-for="item in 3" class="flex justify-between bg-gray-600/20 p-4 rounded-sm animate-pulse h-[52px]">
        </div>
        <div v-else v-for="currency in currencies" class="flex justify-between bg-gray-600/20 p-4 rounded-sm">
            <div class="font-semibold">{{ currency.code }}</div>
            <div class="text-gray-500">({{ currency.symbol }})</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { currencies, getCurrency, isLoading } = useCurrency();

onMounted(() => {
    getCurrency();
});
</script>