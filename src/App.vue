<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="content">
    <header>
      <RouterLink to="/" class="homeBtn">Home</RouterLink>
    </header>
    <main><RouterView /></main>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  flex-direction: column;
  header {
    .homeBtn {
      height: 6vh;
      width: 100%;
      padding-top: 3vh;
      text-align: center;
      display: inline-block;
      background-color: rgb(124, 174, 205);
      text-decoration: none !important;
    }
  }
}
</style>
