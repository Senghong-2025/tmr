<template>
    <div>
        <label v-if="label" class="mb-2 block text-sm font-medium text-slate-700">
            <span v-if="required" class="mr-1 text-red-500">*</span>
            {{ label }}
        </label>

        <div :class="['relative w-full', disabled ? 'opacity-50 cursor-not-allowed' : '']">
            <select v-model="model" :disabled="disabled"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    options: Array<{ label: string; value: string | number }>
    required?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const model = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>
