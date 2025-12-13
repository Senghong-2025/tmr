<template>
    <div class="p-4 overflow-hidden">
        <BodyHeader route="transaction/create" title="Transaction" button-name="New" is-button class="mb-4" />

        <!-- Loading skeleton -->
        <div v-if="isLoading('get') && transactions.length === 0" class="w-full space-y-4">
            <div v-for="item in 6" :key="item" class="animate-pulse">
                <div class="h-4 w-32 bg-gray-700/50 rounded-full mb-3"></div>
                <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                    <div v-for="i in 2" :key="i" class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-700/50 rounded-xl"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-700/50 rounded-full w-3/4"></div>
                            <div class="h-3 bg-gray-700/50 rounded-full w-1/2"></div>
                        </div>
                        <div class="h-5 bg-gray-700/50 rounded-full w-20"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction list -->
        <div v-else @scroll="handleScroll" class="h-[calc(100dvh-180px)] overflow-y-auto transaction-list scroll-smooth" ref="transactionRef">
            <div v-for="(group, index) in filteredTransactionGroups" :key="index" class="mb-6">
                <!-- Date header -->
                <div class="sticky top-0 z-10 py-2 backdrop-blur-md bg-gray-900/80">
                    <span class="text-sm font-medium text-emerald-400 tracking-wide">
                        {{ convertDate(group.date) }}
                    </span>
                </div>

                <!-- Transaction cards container -->
                <div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30">
                    <div v-for="(transaction, tIndex) in group.transactions" :key="transaction.id"
                        @click="goToTransaction(transaction.id)"
                        class="flex items-center gap-4 p-4 hover:bg-gray-700/30 active:bg-gray-700/50 cursor-pointer transition-all duration-200"
                        :class="{ 'border-t border-gray-700/30': tIndex > 0 }">

                        <!-- Icon container -->
                        <div class="relative">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                                :class="transaction.type === 'Outcome' ? 'bg-red-500/10' : 'bg-emerald-500/10'">
                                <ArrowRightIcon
                                    class="w-5 h-5 transition-transform"
                                    :class="transaction.type === 'Outcome'
                                        ? 'text-red-400 -rotate-45'
                                        : 'text-emerald-400 rotate-135'" />
                            </div>
                        </div>

                        <!-- Transaction details -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-100 truncate">{{ transaction.title }}</p>
                            <p class="text-xs text-gray-400 mt-0.5">{{ converTimeOnly(transaction.date) }}</p>
                        </div>

                        <!-- Amount -->
                        <div class="text-right shrink-0">
                            <span class="text-sm font-bold"
                                :class="transaction.type === 'Outcome' ? 'text-red-400' : 'text-emerald-400'">
                                {{ transaction.amountForDisplay }}
                            </span>
                            <p class="text-xs text-gray-500 mt-0.5">{{ transaction.currency }}</p>
                        </div>
                    </div>
                </div>

                <!-- Daily total -->
                <div class="mt-3 px-4 py-3 bg-gray-800/20 rounded-xl border border-gray-700/20">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Daily Total</span>
                        <div class="text-right">
                            <p class="text-sm font-bold" :class="group.totalAmount >= 0 ? 'text-emerald-400' : 'text-red-400'">
                                {{ group.totalAmount >= 0 ? '+' : '' }}{{ group.totalAmount.toFixed(2) }} USD
                            </p>
                            <p v-if="group.totalAmountKhr" class="text-xs text-gray-500 mt-0.5">
                                {{ group.totalAmountKhr.toLocaleString() }} KHR
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Loading more indicator -->
                <div v-if="filteredTransactionGroups.length - 1 === index && !isFinnal"
                    class="flex items-center justify-center gap-2 py-6 text-gray-400">
                    <div class="w-4 h-4 border-2 border-gray-500 border-t-emerald-400 rounded-full animate-spin"></div>
                    <span class="text-sm">Loading more...</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import BodyHeader from '~/components/BodyHeader.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import commonHelper from '~/helpers/datetimeHelper';

const { convertDate, converTimeOnly } = commonHelper;
const {
    transactions,
    getTransaction,
    isLoading,
    goToTransaction,
    filteredTransactionGroups,
    handleScroll,
    transactionRef,
    isFinnal
} = useTransaction();

onMounted(() => {
    getTransaction();
})
</script>