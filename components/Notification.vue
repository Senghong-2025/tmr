<template>
  <div class="notification-wrapper fixed top-4 right-4 space-y-2 z-50">
    <div
      v-for="(n, index) in notifications"
      :key="index"
      class="px-4 py-2 rounded shadow text-white"
      :class="{
        'bg-green-500': n.type === 'success',
        'bg-red-500': n.type === 'error',
        'bg-yellow-500': n.type === 'warning',
        'bg-blue-500': n.type === 'info'
      }"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { notifications } from '~/composables/useNotification'
</script>