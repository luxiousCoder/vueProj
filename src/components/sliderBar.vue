<template>
  <div ref="container" class="container">
    <slot name="content2"></slot>
    <div ref="draggableDiv" :class="['draggable', { notdraggable: props.isDraggable }]">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  //滑块滑动进度
  modelValue: {
    type: Number,
    required: false
  },
  //滑块滑动方向
  dragDirection: {
    type: String,
    required: true,
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  //滑块类型
  type: {
    type: String,
    required: false
  },
  isDraggable: {
    type: Boolean,
    required: false,
    default: true
  }
})

//update:modelValue:在创建组件时自定义更新事件,随着滑块滑动动态返回modelValue的值；ValueChanged：在鼠标离开滑块时返回modelValue的值
const emit = defineEmits(['update:modelValue', 'ValueChanged'])

const container = ref(null)
const draggableDiv = ref(null)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const initialLeft = ref(0)
const initialTop = ref(0)

const onMouseDown = (e) => {
  if (props.isDraggable) return

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

    const newLeftVw = (newLeft / window.innerWidth) * 100
    draggableDiv.value.style.left = `${newLeftVw}vw`
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

    const newTopVh = (newTop / window.innerHeight) * 100
    draggableDiv.value.style.top = `${newTopVh}vh`
  }

  // 更新父组件的值
  emit('update:modelValue', newValue)
}

const onMouseUp = () => {
  isDragging.value = false
  emit('ValueChanged', props)

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  draggableDiv.value.addEventListener('mousedown', onMouseDown)
})

onUnmounted(() => {
  // if (draggableDiv !== null) {
  //   console.log(draggableDiv.value)

  //   draggableDiv.value.removeEventListener('mousedown', onMouseDown)
  // }

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
  user-select: none;
}

.draggable {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: lightblue;
  cursor: grab;
  user-select: none;
}

.draggable:active {
  cursor: grabbing;
  user-select: none;
}

.notdraggable {
  cursor: not-allowed;
  user-select: none;
}
.notdraggable:active {
  cursor: not-allowed;
  user-select: none;
}
</style>
