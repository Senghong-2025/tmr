<template>
    <div class="w-full relative">
        <label v-if="label" class="mb-2 block text-sm font-medium text-slate-700">
            <span v-if="required" class="mr-1 text-red-500">*</span>
            {{ label }}
        </label>

        <div :class="[
            'relative w-full',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]">
            <input :type="type" v-model="model" :placeholder="placeholder" :disabled="disabled" @change="emit('change')" @keydown="emit('keydown')" :max="maxDate ?? ''" :min="minDate ?? ''"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" :inputmode="mode || 'text'"/>
        </div>

        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
        <slot/>
    </div>
</template>

<script setup lang="ts">
import type { TInputMode, TInputType } from '~/models/form';

const props = defineProps<{
    type: TInputType
    modelValue: string | number | Date
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    required?: boolean
    mode?: TInputMode
    maxDate?: string
    minDate?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | Date): void,
    (e: 'change'): void,
    (e: 'keydown'): void,
}>()

const model = computed(({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
}))
</script>
