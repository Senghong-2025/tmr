<template>
    <div class="flex justify-between rounded-sm p-2 items-center bg-gray-200/60">
        <p class="text-[18px] font-medium text-blue-800">{{ title }}</p>
        <div>
            <Button1 v-if="isButton" @click="$router.push(route ?? '')" :name="buttonName" :is-blocked="true" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import Button1 from '@/components/buttons/Button1.vue';

defineProps({
    title: {
        type: String,
        required: false
    },
    route: {
        type: String,
        required: false
    },
    buttonName: {
        type: String,
        required: false
    },
    isButton: {
        type: Boolean,
        required: false,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});
</script>