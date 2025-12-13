<template>
    <div class="space-y-6">
        <!-- User Profile Card -->
        <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <span class="text-2xl font-bold text-emerald-400">
                    {{ user?.username?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
            </div>
            <div class="flex-1">
                <h1 class="text-xl font-bold text-gray-100">{{ user?.username || 'User' }}</h1>
                <p class="text-sm text-gray-400">{{ user?.email || 'No email' }}</p>
            </div>
        </div>

        <!-- User Info Section -->
        <div class="space-y-3">
            <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Information</h2>
            <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-700/20 rounded-xl">
                    <span class="text-sm text-gray-400">Username</span>
                    <span class="text-sm font-medium text-gray-200">{{ user?.username || '-' }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-700/20 rounded-xl">
                    <span class="text-sm text-gray-400">Email</span>
                    <span class="text-sm font-medium text-gray-200">{{ user?.email || '-' }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-700/20 rounded-xl">
                    <span class="text-sm text-gray-400">Phone</span>
                    <span class="text-sm font-medium text-gray-200">{{ user?.phone || '-' }}</span>
                </div>
            </div>
        </div>

        <!-- Monthly Expense Section -->
        <div class="space-y-3">
            <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Summary</h2>
            <div v-if="isLoading('get')" class="p-4 bg-gray-700/20 rounded-xl animate-pulse">
                <div class="h-5 bg-gray-600/50 rounded-full w-1/2 mb-2"></div>
                <div class="h-8 bg-gray-600/50 rounded-full w-3/4"></div>
            </div>
            <div v-else class="p-4 bg-gray-700/20 rounded-xl space-y-3">
                <InputField type="month" v-model:model-value="selectedMonth" @change="onChangeDate()" />
                <div class="flex items-center justify-between pt-2 border-t border-gray-600/30">
                    <span class="text-sm text-gray-400">
                        Total expense of {{ getMonthOnly(String(selectedMonth) || new Date()) }}
                    </span>
                    <span class="text-lg font-bold text-red-400">
                        {{ textHelper.convertAmountWithoutRouteUp(total) }} USD
                    </span>
                </div>
            </div>
        </div>

        <!-- Logout Button -->
        <div class="pt-4">
            <button
                @click="logout"
                class="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all duration-200 active:scale-[0.98]">
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
