<template>
    <button
        :disabled="loading || disabled"
        @click="$emit('click')"
        :class="[
            { 'w-full': !isBlocked },
            colorClass,
            'relative flex items-center justify-center px-5 py-2.5 cursor-pointer rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]'
        ]"
    >
        <span v-if="!loading">
            <slot>{{ name ?? 'Submit' }}</slot>
        </span>

        <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    name?: string
    loading?: boolean
    disabled?: boolean
    isBlocked?: boolean
    type?: 'primary' | 'secondary' | 'danger' | 'info'
}>()

const colorClass = computed(() => {
    switch (props.type) {
        case 'secondary':
            return 'bg-gray-600/50 hover:bg-gray-600 text-gray-200 border border-gray-500/30'
        case 'danger':
            return 'bg-red-500 hover:bg-red-600 text-white'
        case 'primary':
            return 'bg-blue-500 hover:bg-blue-600 text-white'
        case 'info':
            return 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600/30'
        default:
            return 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
    }
})

defineEmits<{
    (e: 'click'): void
}>()
</script>
