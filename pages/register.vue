<template>
    <div class="register-page min-h-screen flex items-center justify-center">
        <form @submit.prevent="register" class="bg-gray-600/20 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <div class="grid gap-2 mb-4">
                <InputField v-model:model-value="registerModel.username" type="text" label="Username" />
                <InputField v-model:model-value="registerModel.phone" type="number" label="Phone" />
                <InputField v-model:model-value="registerModel.email" type="email" label="Email" />
                <InputField v-model:model-value="registerModel.password" type="password" label="Password" />
            </div>
            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
                Register
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import InputField from '@/components/formfields/InputField.vue';
const { register, registerModel } = useAuth();
</script>