<template>
  <div class="app-shell min-h-screen text-app-text transition-colors duration-300">
    <TheNavbar />
    <main class="min-h-[calc(100vh-52px)]">
      <nuxt-page />
    </main>
  </div>
  <Notification />
</template>
<script lang="ts" setup>

</script>
