<template>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p class="text-sm text-slate-500">Manage your data</p>
            <h1 class="text-2xl font-semibold text-slate-900">{{ title }}</h1>
        </div>
        <button
            v-if="isButton"
            @click="$router.push(route ?? '')"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isBackButton" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ buttonName }}
        </button>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    title?: string
    route?: string
    buttonName?: string
    isButton?: boolean
    isLoading?: boolean
}>();

const isBackButton = computed(() => props.buttonName?.toLowerCase().includes('back'));
</script>
