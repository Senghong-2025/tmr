<template>
    <div>
        <label v-if="label" class="block mb-1 text-sm font-medium text-gray-300">
            <span v-if="required" class="text-red-500 ml-1">*</span>
            {{ label }}
        </label>

        <div :class="['relative w-full', disabled ? 'opacity-50 cursor-not-allowed' : '']">
            <select v-model="model" :disabled="disabled"
                class="w-full px-4 py-2 text-sm rounded-sm shadow-sm focus:outline-none focus:ring-1  bg-black/10 focus:ring-blue-500 focus:border-blue-500 transition-all ">
                <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
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