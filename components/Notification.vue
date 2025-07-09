<template>
  <div class="notification-wrapper fixed top-6 right-6 space-y-4 z-50 max-w-sm w-full">
    <transition-group name="fade" tag="div">
      <div
        v-for="(n, index) in notifications"
        :key="index"
        class="flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg text-white relative overflow-hidden ring-1 ring-black/5"
        :class="{
          'bg-green-500': n.type === 'success',
          'bg-red-500': n.type === 'error',
          'bg-yellow-400 text-gray-900': n.type === 'warning',
          'bg-blue-500': n.type === 'info'
        }"
      >
        <span class="mt-1">
          <svg v-if="n.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <svg v-else-if="n.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          <svg v-else-if="n.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"/></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
        </span>
        <div class="flex-1">
          <div class="font-semibold">{{ n.type.toUpperCase() }}</div>
          <div class="text-sm opacity-90">{{ n.message }}</div>
        </div>
        <button
          class="ml-2 text-white/70 hover:text-white transition"
          @click="remove(index)"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { notifications } from '~/composables/useNotification'

function remove(index: number) {
  notifications.splice(index, 1)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>