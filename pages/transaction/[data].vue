<template>
    <div>
        Edit
        <pre>{{ decoded }}</pre>
    </div>
</template>
<script lang="ts" setup>
import type { ITransaction } from '~/models/transaction';

const route = useRoute();

const dataParam = Array.isArray(route.params.data) ? route.params.data[0] : route.params.data;
const decoded = JSON.parse(dataParam) as ITransaction;
</script>