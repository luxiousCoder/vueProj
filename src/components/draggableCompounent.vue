<template>
  <div draggable="true" class="draggable" id="draggable">12376183</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  //可拖动元素的关键在于position的值为absolute，同时可以调用css的cursor属性改变鼠标指针的样式
  const draggableElement = document.getElementById('draggable')
  let offsetX = 0
  let offsetY = 0

  draggableElement.addEventListener('dragstart', (event) => {
    offsetX = event.offsetX
    offsetY = event.offsetY
    event.dataTransfer.effectAllowed = 'copy'
    console.log(123123)
  })

  document.addEventListener('dragover', (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  })

  document.addEventListener('drop', (event) => {
    event.preventDefault()
    const x = event.clientX - offsetX
    const y = event.clientY - offsetY
    draggableElement.style.left = `${x}px`
    draggableElement.style.top = `${y}px`
  })
})
</script>

<style lang="scss" scoped>
.draggable {
  width: 100px;
  height: 100px;
  background-color: lightblue;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
  position: absolute;
}
</style>
