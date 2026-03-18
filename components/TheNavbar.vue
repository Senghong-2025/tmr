<template>
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div v-if="isAuth" class="mx-auto flex h-[52px] max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-5">
            <button class="truncate text-left" @click="$router.push('/')">
                <span class="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Expense Tracker</span>
                <span class="block truncate text-base font-semibold text-slate-900 sm:text-lg">Hi, {{ username }}</span>
            </button>
            <nav class="flex items-center gap-2 overflow-x-auto">
                <NuxtLink
                    v-for="route in mainRoutes" :to="route.path" 
                    class="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    :class="{'bg-blue-50 text-blue-700': isActivedMainRoute(route)}"
                    >{{ route.name }}
                </NuxtLink>
            </nav>
        </div>
    </header>
</template>
<script lang="ts" setup>
import type { IUser } from '~/models/user';

const { isAuth } = useAuth();
const { mainRoutes, isActivedMainRoute } = useNavbar();

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
