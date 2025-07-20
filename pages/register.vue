<template>
    <div class="register-page min-h-screen flex items-center justify-center">
        <form @submit.prevent="register" class="bg-gray-600/20 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <div class="grid gap-2 mb-4">
                <InputField v-model:model-value="registerModel.username" type="text" label="Username" required />
                <InputField v-model:model-value="registerModel.phone" type="tel" label="Phone" required />
                <InputField v-model:model-value="registerModel.email" type="email" label="Email" required />
                <InputField v-model:model-value="registerModel.password" type="password" label="Password" required />
                <InputField v-model:model-value="registerModel.confirmPassword" type="password" label="Confirm Password"
                    required />
            </div>
            <Button1 :loading="loading" name="Register" />
            <div class="text-sm text-gray-500 mt-4 text-center">
                Already have an account? <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import InputField from '@/components/formfields/InputField.vue';
import Button1 from '@/components/buttons/Button1.vue';
const { register, registerModel, loading } = useAuth();
</script>