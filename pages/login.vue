<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>
            <InputField v-model:model-value="loginModel.email" type="email" label="Email" />
            <InputField v-model:model-value="loginModel.password" type="password" label="Password" />
            <Button1 @click="login" :loading="loading" />
        </form>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { loginModel, login, loading } = useAuth();
</script>