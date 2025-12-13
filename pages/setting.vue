<template>
    <div class="p-4 overflow-hidden">
        <BodyHeader title="Setting" class="mb-4" />

        <!-- Tab Navigation -->
        <div class="mb-6">
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <NuxtLink
                    v-for="route in settingRoutes"
                    :to="route.path"
                    :key="route.name"
                    class="px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200"
                    :class="isActived(route)
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:bg-gray-700/30 hover:text-gray-200'">
                    {{ route.name }}
                </NuxtLink>
            </div>
        </div>

        <!-- Page Content -->
        <div class="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-4">
            <NuxtPage />
        </div>
    </div>
</template>
<script lang="ts" setup>
import BodyHeader from '~/components/BodyHeader.vue';
const { settingRoutes, isActived } = useNavbar();
onMounted(() => {
    navigateTo('/setting/profile');
});
</script>