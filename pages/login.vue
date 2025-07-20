<template>
    <div class="min-h-screen flex items-center justify-center p-4">
        <form @submit.prevent="login" class="w-full max-w-md bg-gray-600/20 shadow-xl rounded-sm p-8 space-y-6">
            <h2 class="text-2xl font-bold text-center ">Login</h2>
            <InputField required v-model:model-value="loginModel.email" type="email" label="Email" />
            <InputField required v-model:model-value="loginModel.password" type="password" label="Password" />
            <Button1 :loading="loading" name="Login" />
            <div class="text-sm w-full text-gray-500 text-center">
                Don't have an account? <RouterLink to="/register" class="text-blue-500">Sign up</RouterLink>
            </div>
        </form>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { loginModel, login, loading } = useAuth();
</script>