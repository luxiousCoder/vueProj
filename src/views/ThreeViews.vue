<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { threeScene } from '@/utils/index'

const globalScene = ref()

onMounted(() => {
  globalScene.value = new threeScene('canvas')
})
</script>

<template>
  <canvas id="canvas" class="drawCanvas"></canvas>
</template>

<style scoped>
.drawCanvas {
  width: 80%;
  height: 70%;
}
</style>
