<template>
    <div class="space-y-6">
        <!-- User Profile Card -->
        <div class="surface-card-muted flex items-center gap-4 p-5">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <span class="text-2xl font-bold text-blue-700">
                    {{ user?.username?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
            </div>
            <div class="flex-1">
                <h1 class="text-xl font-bold text-slate-900">{{ user?.username || 'User' }}</h1>
                <p class="text-sm text-slate-500">{{ user?.email || 'No email' }}</p>
            </div>
        </div>

        <!-- User Info Section -->
        <div class="space-y-3">
            <h2 class="section-title">Account Information</h2>
            <div class="space-y-2">
                <div class="surface-card-muted flex items-center justify-between p-3">
                    <span class="text-sm text-slate-500">Username</span>
                    <span class="text-sm font-medium text-slate-800">{{ user?.username || '-' }}</span>
                </div>
                <div class="surface-card-muted flex items-center justify-between p-3">
                    <span class="text-sm text-slate-500">Email</span>
                    <span class="text-sm font-medium text-slate-800">{{ user?.email || '-' }}</span>
                </div>
                <div class="surface-card-muted flex items-center justify-between p-3">
                    <span class="text-sm text-slate-500">Phone</span>
                    <span class="text-sm font-medium text-slate-800">{{ user?.phone || '-' }}</span>
                </div>
            </div>
        </div>

        <!-- Monthly Expense Section -->
        <div class="space-y-3">
            <h2 class="section-title">Monthly Summary</h2>
            <div v-if="isLoading('get')" class="surface-card-muted p-4 animate-pulse">
                <div class="mb-2 h-5 w-1/2 rounded-full bg-slate-200"></div>
                <div class="h-8 w-3/4 rounded-full bg-slate-200"></div>
            </div>
            <div v-else class="surface-card-muted space-y-3 p-4">
                <InputField type="month" label="Month" v-model:model-value="selectedMonth" @change="onChangeDate()" />
                <div class="flex items-center justify-between border-t border-slate-200 pt-2">
                    <span class="text-sm text-slate-500">
                        Total expense of {{ getMonthOnly(String(selectedMonth) || new Date()) }}
                    </span>
                    <span class="text-lg font-bold text-red-600">
                        {{ textHelper.convertAmountWithoutRouteUp(total) }} USD
                    </span>
                </div>
            </div>
        </div>

        <!-- Logout Button -->
        <div class="pt-4">
            <button
                @click="logout"
                class="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 transition hover:bg-red-100">
                Logout
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import useProfile from '~/composables/useProfile';
import textHelper from '~/helpers/textHelper';

const {
    user,
    getTotalTransactionByMonth,
    onChangeDate,
    isLoading,
    total,
    logout,
    getMonthOnly,
    selectedMonth,
} = useProfile();

onMounted(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
        user.value = JSON.parse(rawUser);
    }
    getTotalTransactionByMonth();
});
</script>
