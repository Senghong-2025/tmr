<template>
    <header class="sticky top-0 z-40 border-b border-app-border bg-app-navbar/90 backdrop-blur transition-colors duration-300">
        <div v-if="isAuth" class="mx-auto flex h-[52px] max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-5">
            <button class="truncate text-left" @click="$router.push('/')">
                <span class="block text-xs font-medium uppercase tracking-[0.18em] text-app-subtle">Expense Tracker</span>
                <span class="block truncate text-base font-semibold text-app-text sm:text-lg">Hi, {{ username }}</span>
            </button>
            <div class="flex items-center gap-2">
                <nav class="flex items-center gap-2 overflow-x-auto">
                <NuxtLink
                    v-for="route in mainRoutes" :to="route.path" 
                    class="rounded-full px-3 py-1.5 text-sm font-medium text-app-nav transition hover:bg-app-hover hover:text-app-text"
                    :class="{'bg-app-accent-soft text-app-accent': isActivedMainRoute(route)}"
                    >{{ route.name }}
                </NuxtLink>
                </nav>
                <button
                    type="button"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-surface text-app-text transition hover:bg-app-hover"
                    :aria-label="toggleLabel"
                    :title="toggleLabel"
                    @click="toggleColorMode"
                >
                    <ClientOnly>
                        <svg v-if="colorMode.value === 'dark'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                        </svg>
                        <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v2.25M12 18.75V21M5.64 5.64l1.6 1.6M16.76 16.76l1.6 1.6M3 12h2.25M18.75 12H21M5.64 18.36l1.6-1.6M16.76 7.24l1.6-1.6M15.75 12A3.75 3.75 0 1 1 12 8.25 3.75 3.75 0 0 1 15.75 12Z" />
                        </svg>
                    </ClientOnly>
                </button>
            </div>
        </div>
    </header>
</template>
<script lang="ts" setup>
import type { IUser } from '~/models/user';

const { isAuth } = useAuth();
const { mainRoutes, isActivedMainRoute } = useNavbar();
const colorMode = useColorMode();

const username = ref("");
const toggleLabel = computed(() =>
    colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
);

const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}

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
