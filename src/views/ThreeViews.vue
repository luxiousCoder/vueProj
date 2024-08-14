<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch, Ref } from 'vue'
import { threeScene } from '@/utils/index'
import { resizeWindow, draggable } from '@/utils/index'
let globalScene: Ref<threeScene | null> = ref(null)
let text: any

onMounted(() => {
  // draggable('drawWindow1')
  // resizeWindow('drawWindow1')
  globalScene.value = new threeScene('canvas')
})
</script>

<template>
  <div class="container">
    <div class="control">
      <el-select name="" id="">
        <el-option @click="globalScene?.addBox()" value="ad">addBox</el-option>
        <el-option @click="globalScene?.plot('arrow')" value="ad1">arrow</el-option>
        <el-option @click="globalScene?.plot('point')" value="ad23">point</el-option>
        <el-option @click="globalScene?.plot('polylines')" value="ad233">polylines</el-option>
        <el-option @click="globalScene?.plot('plane')" value="ad22">plane</el-option>
        <el-option @click="globalScene?.plot('line')" value="ad13">line</el-option>
      </el-select>
    </div>
    <div class="canvasField" id="canvasField">
      <canvas id="canvas" class="drawCanvas"> </canvas>
      <span v-if="globalScene != null" class="promptText" id="promptText">{{
        globalScene.pickedText
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 98%;
  border: none;
  display: flex;
  flex-direction: column;
  .control {
    width: 100%;
    height: 15%;
    display: flex;
    gap: 1vw;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .canvasField {
    position: relative;
    height: 85%;
    .drawCanvas {
      width: 100%;
      height: 100%;
      background-color: transparent;
      display: block;
    }
    .promptText {
      width: 10%;
      height: 15%;
      font-size: 1vw;
      left: 0;
      top: 0;
      display: flex;
      align-content: center;
      justify-content: center;
      position: absolute;
      background-color: antiquewhite;
      flex-wrap: wrap;
    }
  }
}
</style>
