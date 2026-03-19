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
            <div class="my-5 relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200"></div>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-white px-3 text-slate-400">or</span>
                </div>
            </div>
            <Button1 :disabled="loading" type="secondary" @click="loginWithGoogle">
                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.9 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.2-.2-1.7H12Z" />
                        <path fill="#34A853" d="M2.8 12c0 1.6.4 3.1 1.2 4.4l3.4-2.6c-.2-.6-.4-1.2-.4-1.8s.1-1.2.4-1.8L4 7.6C3.2 8.9 2.8 10.4 2.8 12Z" />
                        <path fill="#FBBC05" d="M12 21.3c2.5 0 4.6-.8 6.2-2.3l-3-2.3c-.8.5-1.8.8-3.2.8-2.5 0-4.7-1.7-5.4-4l-3.5 2.7c1.6 3 4.8 5.1 8.9 5.1Z" />
                        <path fill="#4285F4" d="M20.8 12.3c0-.6-.1-1.2-.2-1.7H12v3.9h4.9c-.2 1-.8 1.8-1.7 2.4l3 2.3c1.7-1.6 2.6-3.9 2.6-6.9Z" />
                    </svg>
                    <span>Continue with Google</span>
                </span>
            </Button1>
            <div class="mt-4 text-center text-sm text-slate-500">
                Already have an account? <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-700">Login</RouterLink>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import InputField from '@/components/formfields/InputField.vue';
import Button1 from '@/components/buttons/Button1.vue';

const { register, registerModel, loginWithGoogle, loginWithGoogleRedirectResult, loading } = useAuth();

onMounted(() => {
    loginWithGoogleRedirectResult();
});
</script>
