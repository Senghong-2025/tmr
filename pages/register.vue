<template>
    <div class="flex min-h-screen items-center justify-center px-4 py-10">
        <form @submit.prevent="register" class="surface-card w-full max-w-md p-8">
            <div class="mb-6 space-y-2 text-center">
                <p class="section-title">Create account</p>
                <h2 class="text-3xl font-semibold text-slate-900">Register</h2>
                <p class="text-sm text-slate-500">Set up your profile in a few steps.</p>
            </div>
            <div class="grid gap-4 mb-5">
                <InputField v-model:model-value="registerModel.username" type="text" label="Username" required />
                <InputField v-model:model-value="registerModel.phone" type="tel" label="Phone" required />
                <InputField v-model:model-value="registerModel.email" type="email" label="Email" required />
                <InputField v-model:model-value="registerModel.password" type="password" label="Password" required />
                <InputField v-model:model-value="registerModel.confirmPassword" type="password" label="Confirm Password"
                    required />
            </div>
            <Button1 :loading="loading" name="Register" native-type="submit" />
            <div class="mt-4 text-center text-sm text-slate-500">
                Already have an account? <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-700">Login</RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import InputField from '@/components/formfields/InputField.vue';
import Button1 from '@/components/buttons/Button1.vue';
const { register, registerModel, loading } = useAuth();
</script>
