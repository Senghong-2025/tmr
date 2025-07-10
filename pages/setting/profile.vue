<template>
    <div>
        Profile
        <div class="fixed block bottom-2 bg-transparent right-2">
            <Button1 @click="logout" name="Logout" type="danger" is-blocked />
        </div>
    </div>
</template>
<script lang="ts" setup>
import Button1 from '~/components/buttons/Button1.vue';

const { logout } = useAuth();
</script>