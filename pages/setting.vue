<template>
    <div class="p-4">
        <BodyHeader title="Setting" />
    </div>
    <div class="flex gap-4 mb-4 overflow-x-auto w-screen">
        <NuxtLink v-for="route in settingRoutes" :to="route.path" :key="route.name"
            class="py-1.5 px-4 bg-black/10 font-medium cursor-pointer min-w-[150px] rounded-sm flex justify-center"
            :class="{ 'bg-gray-400/20 text-green-500': isActived(route) }">
            {{ route.name }}
        </NuxtLink>
    </div>
    <div class="p-4">
        <NuxtPage />
    </div>
</template>
<script lang="ts" setup>
import BodyHeader from '~/components/BodyHeader.vue';
const { settingRoutes, isActived } = useNavbar();
onMounted(() => {
    navigateTo('/setting/profile');
});
</script>