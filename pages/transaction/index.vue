<template>
    <div class="p-4">
        <div class="flex justify-between pb-2">
            <p class="text-[18px] font-medium text-blue-800">Transaction</p>
            <Button1 @click="$router.push('/transaction/create')" name="New" :is-blocked="true" />
        </div>
        <div v-if="isLoading">
            <div class="flex flex-wrap gap-4">
                <div v-for="item in 10" :key="item" class="w-sm">
                    <div class="flex items-center p-4 h-[52px] bg-gray-200 rounded-sm animate-pulse space-x-4">
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex flex-wrap gap-4">
                <div class="w-sm" v-for="(transaction, index) in transactions" :key="index">
                    <div
                        class="flex items-center p-4 h-[52px] bg-gray-100/50 shadow-xl border-1 border-blue-200  rounded-sm space-x-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium">{{ transaction.amount }}</p>
                            <p class="text-xs text-gray-500">{{ transaction.note }}</p>
                        </div>
                        <span class="text-sm font-semibold">{{ transaction.amount }} {{ transaction.currecy }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Button1 from '~/components/buttons/Button1.vue';
const {
    transactions,
    getTranscation,
    isLoading
} = useTransaction();

onMounted(() => {
    getTranscation();
})
</script>