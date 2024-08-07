<template>
  <div ref="container" class="container">
    <div ref="draggableDiv" class="draggable">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  dragDirection: {
    type: String,
    required: true,
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  isText: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const container = ref(null)
const draggableDiv = ref(null)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialLeft = ref(0)
const initialTop = ref(0)

const onMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  initialLeft.value = draggableDiv.value.offsetLeft
  initialTop.value = draggableDiv.value.offsetTop
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e) => {
  if (!isDragging.value) return

  const containerRect = container.value.getBoundingClientRect()
  const draggableRect = draggableDiv.value.getBoundingClientRect()

  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value

  let newLeft = initialLeft.value
  let newTop = initialTop.value
  let newValue = 0

  if (props.dragDirection === 'horizontal') {
    newLeft = initialLeft.value + dx

    // 限制在父容器的水平范围内
    if (newLeft < 0) {
      newLeft = 0
    } else if (newLeft + draggableRect.width > containerRect.width) {
      newLeft = containerRect.width - draggableRect.width
    }

    newValue = Math.round((newLeft / (containerRect.width - draggableRect.width)) * 100)
  }

  if (props.dragDirection === 'vertical') {
    newTop = initialTop.value + dy

    // 限制在父容器的垂直范围内
    if (newTop < 0) {
      newTop = 0
    } else if (newTop + draggableRect.height > containerRect.height) {
      newTop = containerRect.height - draggableRect.height
    }

    newValue = Math.round((newTop / (containerRect.height - draggableRect.height)) * 100)
  }

  draggableDiv.value.style.left = `${newLeft}px`
  draggableDiv.value.style.top = `${newTop}px`

  // 更新父组件的值
  emit('update:modelValue', newValue)
}

const onMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  draggableDiv.value.addEventListener('mousedown', onMouseDown)
})

onUnmounted(() => {
  draggableDiv.value.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style>
.container {
  position: relative;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
}

.draggable {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: lightblue;
  cursor: grab;
}

.draggable:active {
  cursor: grabbing;
}
</style>
