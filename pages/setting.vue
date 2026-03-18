<template>
    <div class="page-shell overflow-hidden">
        <BodyHeader title="Settings" class="mb-6" />

        <!-- Tab Navigation -->
        <div class="mb-6">
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <NuxtLink
                    v-for="route in settingRoutes"
                    :to="route.path"
                    :key="route.name"
                    class="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition"
                    :class="isActived(route)
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'">
                    {{ route.name }}
                </NuxtLink>
            </div>
        </div>

        <!-- Page Content -->
        <div class="surface-card p-4 sm:p-6">
            <NuxtPage />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BodyHeader from '~/components/BodyHeader.vue';
const { settingRoutes, isActived } = useNavbar();
const route = useRoute();
onMounted(() => {
    if (route.path === '/setting') {
        navigateTo('/setting/profile');
    }
});
</script>
