<template>
    <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p class="text-xs text-slate-500 sm:text-sm">Manage your data</p>
            <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">{{ title }}</h1>
        </div>
        <button
            v-if="isButton"
            @click="$router.push(route ?? '')"
            class="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
