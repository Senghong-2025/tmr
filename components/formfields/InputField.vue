<template>
    <div class="w-full">
        <label v-if="label" class="block mb-1 text-sm font-medium text-gray-300">
            <span v-if="required" class="text-red-500 ml-1">*</span>
            {{ label }}
        </label>

        <div :class="[
            'relative w-full',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]">
            <input :type="type" v-model="model" :placeholder="placeholder" :disabled="disabled"
                class="w-full px-4 py-2 text-sm rounded-sm bg-black/10 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all " :inputmode="mode || 'none'"/>
        </div>

        <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import type { TInputMode, TInputType } from '~/models/form';

const props = defineProps<{
    type: TInputType
    modelValue: string | number
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    required?: boolean
    mode?: TInputMode
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const model = computed(({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
}))
</script>
