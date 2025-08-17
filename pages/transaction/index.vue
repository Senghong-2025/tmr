<template>
    <div class="p-4 overflow-hidden">
        <BodyHeader route="transaction/create" title="Transaction" button-name="New" is-button class="mb-2" />
        <div v-if="isLoading('get')">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="item in 10" :key="item">
                    <div class="flex items-center p-4 h-[52px] bg-gray-600/20 rounded-sm animate-pulse space-x-4">
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="h-[calc(100vh-250px)] overflow-y-auto">
            <div class="flex gap-2 items-center py-2">
                <div>
                    Search
                </div>
                <InputField v-model:model-value="searchModel" :placeholder="'search'" type="text">
                    <button v-if="isShowClearBtn" @click="onClear"
                        class="absolute right-0 top-0 bottom-0 flex justify-center items-center active:bg-gray-300/30 h-[40px] w-[40px] rounded-full">
                        <img class="w-4 h-4 invert-[70%] sepia-[20%] saturate-[500%] hue-rotate-[180deg]"
                            :src="RemoveIcon" alt="cancel">
                    </button>
                </InputField>
                <button @click="onSearch()"
                    class="bg-blue-900 shrink h-[38px] w-[100px] flex justify-center rounded-md items-center">
                    <img class="w-4 h-4 invert-[100%]" :src="SearchIcon" alt="search icon">
                </button>
            </div>
            <div v-for="(group, index) in filteredTransactionGroups" :key="index" class="grid relative">
                <div
                    class="flex w-full border-b-1 text-sm border-gray-300 bg-gray-700 py-2 px-2 z-10 mb-2 text-green-500 sticky top-0">
                    {{ convertDate(group.date) }}</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div v-for="transaction in group.transactions" :key="transaction.id"
                        @click="goToTransaction(transaction.id)"
                        class="h-[52px] bg-gray-600/20 shadow-xl rounded-sm flex items-center justify-between gap-2 text-white px-2">
                        <div class="w-[40px] h-[40px] rounded-full bg-gray-200 relative shrink-0">
                            <div
                                class="w-4 h-4 flex justify-center items-center rounded-full bg-red-500 absolute -top-1 -right-1">
                                <ArrowRightIcon class="w-[10px] h-[10px] text-gray-100 -rotate-45" />
                            </div>
                        </div>
                        <div class="flex w-full items-center justify-between">
                            <div>
                                <p class="text-sm font-medium">{{ transaction.title }}</p>
                                <p class="text-xs text-gray-300">{{ converTimeOnly(transaction.date) }}</p>
                            </div>
                            <span class="text-sm font-semibold">
                                {{ transaction.amountForDisplay }} {{ transaction.currency }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between bg-gray-600/20 p-4 rounded-sm text-sm font-semibold mb-4">
                    <div class="text-gray-200">Total:</div>
                    <div class="text-red-500 flex flex-col items-end">
                        <span>{{ group.totalAmount }} USD($)</span>
                        <span v-if="group.totalAmountKhr">{{ group.totalAmountKhr }} KHR(៛)</span>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import BodyHeader from '~/components/BodyHeader.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import commonHelper from '~/helpers/datetimeHelper';
import InputField from '~/components/formfields/InputField.vue';
import SearchIcon from "@/assets/icons/search.png"
import RemoveIcon from "@/assets/icons/cancel.png"

const { convertDate, convertDateTime, converTimeOnly } = commonHelper;
const {
    transactions,
    getTranscation,
    isLoading,
    goToTransaction,
    transactionGroups,
    searchModel,
    onSearch,
    filteredTransactionGroups,
    onClear,
    isShowClearBtn,
} = useTransaction();


onMounted(() => {
    getTranscation();
    onSearch();
})
</script>