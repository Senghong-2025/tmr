<template>
    <div class="min-h-screen flex items-center justify-center">
        <form class="w-full max-w-md bg-gray-600/20 shadow-xl rounded-sm p-8 space-y-6">
            <h2 class="text-2xl font-bold text-center ">Login</h2>
            <InputField required v-model:model-value="loginModel.email" type="email" label="Email" />
            <InputField required v-model:model-value="loginModel.password" type="password" label="Password" />
            <Button1 @click="login" :loading="loading" />
        </form>
    </div>
</template>
<script lang="ts" setup>
import InputField from '~/components/formfields/InputField.vue';
import Button1 from '~/components/buttons/Button1.vue';

const { loginModel, login, loading } = useAuth();
</script>