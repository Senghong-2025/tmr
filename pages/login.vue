<template>
    <div class="flex min-h-screen items-center justify-center px-4 py-10">
        <form @submit.prevent="login" class="surface-card w-full max-w-md space-y-6 p-8">
            <div class="space-y-2 text-center">
                <p class="section-title">Welcome back</p>
                <h2 class="text-3xl font-semibold text-slate-900">Login</h2>
                <p class="text-sm text-slate-500">Use your account to manage your transactions.</p>
            </div>
            <InputField required v-model:model-value="loginModel.email" type="email" label="Email" />
            <InputField required v-model:model-value="loginModel.password" type="password" label="Password" />
            <Button1 :loading="loading" name="Login" native-type="submit" />
            <div class="text-center text-sm text-slate-500">
                Don't have an account? <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-700">Sign up</RouterLink>
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { loginModel, login, loading } = useAuth();
</script>
