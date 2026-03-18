<template>
    <button
        :type="nativeType ?? 'button'"
        :disabled="loading || disabled"
        @click="$emit('click')"
        :class="[
            { 'w-full': !isBlocked },
            colorClass,
            'relative inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50'
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
    nativeType?: 'button' | 'submit'
}>()

const colorClass = computed(() => {
    switch (props.type) {
        case 'secondary':
            return 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
        case 'danger':
            return 'bg-red-600 text-white hover:bg-red-700'
        case 'primary':
            return 'bg-blue-600 text-white hover:bg-blue-700'
        case 'info':
            return 'border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100'
        default:
            return 'bg-slate-900 text-white hover:bg-slate-800'
    }
})

defineEmits<{
    (e: 'click'): void
}>()
</script>
