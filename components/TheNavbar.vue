<template>
    <header class="header bg-gray-600/10 text-white h-[52px] flex items-center shadow-xl">
        <div v-if="isAuth" class="container mx-auto flex items-center justify-between px-4">
            <h1 class="text-2xl font-bold">Hi, {{ username }}</h1>
            <nav class="space-x-4">
                <NuxtLink to="/transaction" class="hover:underline">Transaction</NuxtLink>
                <NuxtLink to="/setting/profile" class="hover:underline">Setting</NuxtLink>
                <!-- <NuxtLink href="#" class="hover:underline" @click="logout"> logout</NuxtLink> -->
            </nav>
        </div>
    </header>
</template>
<script lang="ts" setup>
import type { IUser } from '~/models/user';

const { logout, loading, isAuth } = useAuth();

const username = ref("");
const getUsername = () => {
    const rawUser = localStorage.getItem("user");
    if (isAuth.value && rawUser) {
        const user = JSON.parse(rawUser) as IUser
        username.value = user.username;
    }
}

onMounted(() => {
    getUsername();
})
</script>