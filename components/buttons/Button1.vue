<template>
    <button
        :disabled="loading || disabled"
        @click="$emit('click')"
        :class="[
            { 'w-full': !isBlocked },
            colorClass,
            'relative flex items-center justify-center px-4 py-1.5 cursor-pointer rounded-sm text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        ]"
    >
        <span v-if="!loading">
            <slot>{{ name ?? 'Submit' }}</slot>
        </span>

        <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
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
    type?: 'primary' | 'secondary' | 'danger' | 'info' // Add more types as needed
}>()

const colorClass = computed(() => {
    switch (props.type) {
        case 'secondary':
            return 'bg-gray-500 hover:bg-gray-600'
        case 'danger':
            return 'bg-red-600 hover:bg-red-700'
        case 'primary':
            return 'bg-blue-600 hover:bg-blue-700'
        case 'info':
            return 'bg-gray-400 hover:bg-gray-400'
        default:
            return 'bg-blue-800 hover:bg-blue-900'
    }
})

defineEmits<{
    (e: 'click'): void
}>()
</script>
