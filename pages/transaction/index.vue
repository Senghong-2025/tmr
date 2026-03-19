<template>
    <div class="page-shell overflow-hidden">
        <BodyHeader route="/transaction/create" title="Transactions" button-name="New transaction" is-button class="mb-6" />

        <div class="mb-4 flex items-end gap-2.5">
            <div class="w-full max-w-xs">
                <SelectField
                    v-model="searchModel.category"
                    label="Category"
                    placeholder="All categories"
                    :options="categoryOptions"
                    @update:model-value="onSearch"
                />
            </div>
            <button
                v-if="isShowClearBtn"
                type="button"
                class="min-h-10 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                @click="onClear"
            >
                Clear
            </button>
        </div>

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
            <div v-for="(group, index) in filteredTransactionGroups" :key="index" class="mb-5">
                <!-- Date header -->
                <div class="sticky top-0 z-10 py-1.5 backdrop-blur-md">
                    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 sm:text-sm">
                        {{ convertDate(group.date) }}
                    </span>
                </div>

                <!-- Transaction cards container -->
                <div class="surface-card overflow-hidden">
                    <div v-for="(transaction, tIndex) in group.transactions" :key="transaction.id"
                        @click="goToTransaction(transaction.id)"
                        class="flex cursor-pointer items-center gap-3.5 p-3.5 transition hover:bg-slate-50"
                        :class="{ 'border-t border-slate-200': tIndex > 0 }">

                        <!-- Icon container -->
                        <div class="relative">
                            <div class="flex h-11 w-11 items-center justify-center rounded-xl"
                                :class="transaction.type === 'Outcome' ? 'bg-red-50' : 'bg-emerald-50'">
                                <ArrowRightIcon
                                    class="h-4.5 w-4.5 transition-transform"
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
                            <span class="text-sm font-semibold"
                                :style="blurStyle"
                                :class="transaction.type === 'Outcome' ? 'text-red-600' : 'text-emerald-600'">
                                {{ transaction.amountForDisplay }}
                            </span>
                            <p class="mt-0.5 text-xs text-slate-500">{{ transaction.currency }}</p>
                        </div>
                    </div>
                </div>

                <!-- Daily total -->
                <div class="surface-card-muted mt-2.5 px-3.5 py-2.5">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Daily total</span>
                        <div class="text-right">
                            <p class="text-sm font-semibold" :style="blurStyle" :class="group.totalAmount >= 0 ? 'text-emerald-600' : 'text-red-600'">
                                {{ group.totalAmount >= 0 ? '+' : '' }}{{ group.totalAmount.toFixed(2) }} USD
                            </p>
                            <p v-if="group.totalAmountKhr" class="mt-0.5 text-xs text-slate-500" :style="blurStyle">
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
import SelectField from '~/components/formfields/SelectField.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import commonHelper from '~/helpers/datetimeHelper';
import usePrivacy from '~/composables/usePrivacy';

const { convertDate, converTimeOnly } = commonHelper;
const { blurStyle, loadSettings } = usePrivacy();
const {
    transactions,
    getTransaction,
    isLoading,
    goToTransaction,
    filteredTransactionGroups,
    categories,
    getCategory,
    searchModel,
    onSearch,
    onClear,
    isShowClearBtn,
    handleScroll,
    transactionRef,
    isFinnal
} = useTransaction();

const categoryOptions = computed(() => categories.value.map((category) => ({
    label: category.name,
    value: category.name
})));

onMounted(() => {
    loadSettings();
    getCategory();
    getTransaction();
})
</script>
