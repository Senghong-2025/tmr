<template>
    <div class="page-shell overflow-hidden">
        <BodyHeader route="/transaction/create" title="Transactions" button-name="New transaction" is-button class="mb-6" />

        <!-- Loading skeleton -->
        <div v-if="isLoading('get') && transactions.length === 0" class="w-full space-y-4">
            <div v-for="item in 6" :key="item" class="animate-pulse">
                <div class="mb-3 h-4 w-32 rounded-full bg-slate-200"></div>
                <div class="surface-card p-4 space-y-3">
                    <div v-for="i in 2" :key="i" class="flex items-center gap-4">
                        <div class="h-12 w-12 rounded-xl bg-slate-200"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 w-3/4 rounded-full bg-slate-200"></div>
                            <div class="h-3 w-1/2 rounded-full bg-slate-200"></div>
                        </div>
                        <div class="h-5 w-20 rounded-full bg-slate-200"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction list -->
        <div v-else @scroll="handleScroll" class="h-[calc(100dvh-180px)] overflow-y-auto transaction-list scroll-smooth" ref="transactionRef">
            <div v-for="(group, index) in filteredTransactionGroups" :key="index" class="mb-6">
                <!-- Date header -->
                <div class="sticky top-0 z-10 py-2 backdrop-blur-md">
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {{ convertDate(group.date) }}
                    </span>
                </div>

                <!-- Transaction cards container -->
                <div class="surface-card overflow-hidden">
                    <div v-for="(transaction, tIndex) in group.transactions" :key="transaction.id"
                        @click="goToTransaction(transaction.id)"
                        class="flex cursor-pointer items-center gap-4 p-4 transition hover:bg-slate-50"
                        :class="{ 'border-t border-slate-200': tIndex > 0 }">

                        <!-- Icon container -->
                        <div class="relative">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl"
                                :class="transaction.type === 'Outcome' ? 'bg-red-50' : 'bg-emerald-50'">
                                <ArrowRightIcon
                                    class="w-5 h-5 transition-transform"
                                    :class="transaction.type === 'Outcome'
                                        ? 'text-red-500 -rotate-45'
                                        : 'text-emerald-500 rotate-135'" />
                            </div>
                        </div>

                        <!-- Transaction details -->
                        <div class="flex-1 min-w-0">
                            <p class="truncate text-sm font-semibold text-slate-900">{{ transaction.title }}</p>
                            <p class="mt-0.5 text-xs text-slate-500">{{ converTimeOnly(transaction.date) }}</p>
                        </div>

                        <!-- Amount -->
                        <div class="text-right shrink-0">
                            <span class="text-sm font-bold"
                                :class="transaction.type === 'Outcome' ? 'text-red-600' : 'text-emerald-600'">
                                {{ transaction.amountForDisplay }}
                            </span>
                            <p class="mt-0.5 text-xs text-slate-500">{{ transaction.currency }}</p>
                        </div>
                    </div>
                </div>

                <!-- Daily total -->
                <div class="surface-card-muted mt-3 px-4 py-3">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Daily total</span>
                        <div class="text-right">
                            <p class="text-sm font-bold" :class="group.totalAmount >= 0 ? 'text-emerald-600' : 'text-red-600'">
                                {{ group.totalAmount >= 0 ? '+' : '' }}{{ group.totalAmount.toFixed(2) }} USD
                            </p>
                            <p v-if="group.totalAmountKhr" class="mt-0.5 text-xs text-slate-500">
                                {{ group.totalAmountKhr.toLocaleString() }} KHR
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Loading more indicator -->
                <div v-if="filteredTransactionGroups.length - 1 === index && !isFinnal"
                    class="flex items-center justify-center gap-2 py-6 text-slate-500">
                    <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></div>
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
