<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { threeScene } from '@/utils/index'

let globalScene: threeScene

onMounted(() => {
  globalScene = new threeScene('canvas')
  globalScene.addEllipseCurve(20, 20)
  console.log(globalScene.scene)
})
</script>

<template>
  <canvas id="canvas" class="drawCanvas"></canvas>
</template>

<style scoped>
.drawCanvas {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
</style>
