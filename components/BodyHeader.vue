<template>
    <div class="flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-100">{{ title }}</h1>
        <button
            v-if="isButton"
            @click="$router.push(route ?? '')"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium text-sm transition-all duration-200 active:scale-[0.98] flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ buttonName }}
        </button>
    </div>
</template>
<script lang="ts" setup>
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