<template>
    <div class="flex justify-between p-2">
        <p class="text-[18px] font-medium text-blue-800">Transaction</p>
        <Button1 @click="$router.push('/transaction/create')" name="New" :is-blocked="true" />
    </div>
    <div>
    </div>
    <pre>{{ transactions }}</pre>
</template>
<script lang="ts" setup>
import Button1 from '~/components/buttons/Button1.vue';

const { transactions,
    getTranscation, } = useTransaction();

onMounted(() => {
    getTranscation();
})
</script>