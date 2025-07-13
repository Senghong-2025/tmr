<template>
    <div>
        <div class="flex justify-center flex-col gap-4">
            <h1 class="text-2xl font-bold">Username: {{ user?.username }}</h1>
            <p class="text-gray-500">Email: {{ user?.email }}</p>
            <p class="text-gray-500">Phone: {{ user?.phone }}</p>
        </div>
        <div class="mt-4 flex justify-end">
            <div v-if="isLoading" class="h-[32px] bg-gray-600/20 animate-pulse w-full">
            </div>
            <div v-else><span class="text-green-500">Total expense of {{ getMonthOnly(new Date()) }}:</span> <span
                    class="text-red-500">{{ total }} </span> USD</div>
        </div>
    </div>
    <div class="fixed block bottom-2 bg-transparent right-2">
        <Button1 @click="logout" name="Logout" type="danger" is-blocked />
    </div>
</template>
<script lang="ts" setup>
import Button1 from '~/components/buttons/Button1.vue';
import commonHelper from '~/helpers/datetimeHelper';
import type { IUser } from '~/models/user';

const user = ref<IUser | null>(null);
const { logout } = useAuth();
const { getMonthOnly } = commonHelper;
const { getTotalTransactionByMonth, total, isLoading } = useTransaction();

onMounted(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
        user.value = JSON.parse(rawUser);
    }
    getTotalTransactionByMonth();
});
</script>