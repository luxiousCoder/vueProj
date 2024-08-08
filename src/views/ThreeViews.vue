<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch, Ref } from 'vue'
import { threeScene } from '@/utils/index'

let globalScene: Ref<threeScene | null> = ref(null)

onMounted(() => {
  globalScene.value = new threeScene('canvas')
})
</script>

<template>
  <div class="container">
    <div class="control">
      <button @click="globalScene?.addBox()">addBox</button>
      <button @click="globalScene?.addPickListener()">addPickListener</button>
      <button @click="globalScene?.addEllipseCurve(20, 20)">addEllipseCurve</button>
      <button @click="globalScene?.removePickListener()">removePickListener</button>
      <button @click="globalScene?.plot">plot</button>
    </div>
    <div class="canvasField">
      <canvas id="canvas" class="drawCanvas"> </canvas>
      <span v-if="globalScene != null" class="promptText">{{ globalScene.pickedText }}</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .control {
    width: 100%;
    height: 10vh;
    display: flex;
    gap: 1vw;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .canvasField {
    position: relative;
    .drawCanvas {
      width: 100%;
      height: 80vh;
      background-color: transparent;
      display: block;
    }
    .promptText {
      height: 16vh;
      width: 20vw;
      font-size: 1vw;
      left: 0;
      top: 0;
      display: flex;
      align-content: center;
      justify-content: center;
      position: absolute;
      background-color: antiquewhite;
      z-index: 10000;
      flex-wrap: wrap;
    }
  }
}
</style>
