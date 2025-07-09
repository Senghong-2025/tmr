<template>
  <div class="bg-gradient-to-br from-[#203249] to-[#19263d] text-white min-h-screen">
    <TheNavbar />
    <div class=" min-h-[calc(100vh-52px)]"><nuxt-page /></div>
  </div>
  <Notification />
</template>
<script lang="ts" setup>

</script>
<style>
body {
  background-color: #19263d;
}
</style>