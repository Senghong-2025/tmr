<template>
  <div class="app-shell min-h-screen text-slate-900">
    <TheNavbar />
    <main class="min-h-[calc(100vh-52px)]">
      <nuxt-page />
    </main>
  </div>
  <Notification />
</template>
<script lang="ts" setup>

</script>
<style>
body {
  background-color: #f5f7fb;
}
</style>
