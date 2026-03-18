<template>
  <div class="notification-wrapper fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm space-y-3">
    <transition-group name="fade" tag="div">
      <div
        v-for="(n, index) in notifications"
        :key="index"
        class="relative mt-2 flex items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3 shadow-lg"
        :class="{
          'border-emerald-200 bg-emerald-50 text-emerald-900': n.type === 'success',
          'border-red-200 bg-red-50 text-red-900': n.type === 'error',
          'border-amber-200 bg-amber-50 text-amber-900': n.type === 'warning',
          'border-blue-200 bg-blue-50 text-blue-900': n.type === 'info'
        }"
      >
        <span class="mt-1">
          <svg v-if="n.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <svg v-else-if="n.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          <svg v-else-if="n.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"/></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
        </span>
        <div class="flex-1">
          <div class="font-semibold capitalize">{{ n.type }}</div>
          <div class="text-sm opacity-90">{{ n.message }}</div>
        </div>
        <button
          class="ml-2 opacity-60 transition hover:opacity-100"
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
