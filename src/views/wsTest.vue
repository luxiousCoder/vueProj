<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { webSocketInstance, coordiArrayTrans } from '@/utils/index'
import { getOption } from '@/assets/hooks/wsOptions'

const wsres = ref()
const wsres2 = ref()
let arr: any = []
const damageEffectParamsArr: Array<any> = []
const isGetAllCoordDone = ref(false)
const isGetAllImgDone = ref(false)
const text = ref('isFeching')
const progress = ref(0)

watch(isGetAllCoordDone && isGetAllImgDone, (params) => {
  if (isGetAllCoordDone && isGetAllImgDone) {
    text.value = 'done'
  }
})

const disposeCoord = (data: any) => {
  const cooddata = JSON.parse(data.detail.data.replace(/([a-zA-Z]+)=/g, '"$1":').replace(/'/g, '"'))
  arr = arr.concat([[Number(cooddata.x), Number(cooddata.y), Number(cooddata.z)]])
  const transedData = coordiArrayTrans(arr, [120, 30, 0])
  wsres.value = transedData
  // isDone.value = true
  if (transedData.length === 60) {
    isGetAllCoordDone.value = true
  }
}

let index = 0
const disposeImg = (data: any) => {
  // 去掉[]及其之后的内容
  // eslint-disable-next-line no-unsafe-optional-chaining
  index += 1
  if (data) {
    const [trimmedStr, tail] = data.detail.data?.split('[]')
    // eslint-disable-next-line no-unsafe-optional-chaining
    const [col, row] = tail?.replace(/ /g, ',')?.split(',')?.map(Number)
    // 将分号替换为逗号
    const replacedStr = trimmedStr?.replace(/;/g, ',')
    // 将字符串解析为一维数组
    const array = replacedStr?.split(',')?.map(Number)
    progress.value = index / 60
    damageEffectParamsArr.push({ wid: 100, dim: col * 0.5, col, row, data: array })
    if (damageEffectParamsArr.length === 60) {
      isGetAllImgDone.value = true
    }
  }
}

const getAllCoord = () => {
  const wsObj = new webSocketInstance(getOption(1, 'coordinate'), 'onmessageWS', () => {
    for (let index = 0; index < 60; index++) {
      wsObj.send(JSON.stringify(getOption(index, 'coordinate').sendMessage))
      console.log('getAllCoordrun!')
    }
  })
}

const getCoord = (index: number) => {
  const wsObj = new webSocketInstance(getOption(1, 'coordinate'), 'onmessageWS', () => {
    wsObj.send(JSON.stringify(getOption(index, 'coordinate').sendMessage))
    console.log('getCoordRun!')
  })
}

const getAllImg = () => {
  const wsObj = new webSocketInstance(getOption(1, 'img'), 'onmessageWSImg', () => {
    for (let index = 0; index < 60; index++) {
      wsObj.send(JSON.stringify(getOption(index, 'img').sendMessage))
      console.log('getAllCoordrun!')
    }
  })
}

const getImg = (index: number) => {
  const wsObj = new webSocketInstance(getOption(1, 'img'), 'onmessageWSImg', () => {
    wsObj.send(JSON.stringify(getOption(index, 'img').sendMessage))
    console.log('getCoordRun!')
  })
}

const arrayTest = () => {
  // 定义两个对象
  const obj1 = { a: 1, b: 2 }
  const obj2 = { c: 3, d: 4 }

  // 定义一个数组
  const array = []

  // 将对象添加到数组中
  array.push(obj1)
  array.push(obj2)

  wsres.value = array
}

onMounted(() => {
  getAllCoord()
  // getCoord(30)
  getAllImg()
  // getImg(60)
  window.addEventListener('onmessageWS', disposeCoord)
  window.addEventListener('onmessageWSImg', disposeImg)
  // arrayTest()
})

onBeforeUnmount(() => {
  window.removeEventListener('onmessageWS', disposeCoord)
  window.removeEventListener('onmessageWSImg', disposeImg)
})
</script>

<template>
  <!-- <button @click="wsTrigger" style="width: 10vw; height: 20vh"></button> -->
  {{ text }} {{ progress }} <br />{{ wsres }}
</template>

<style lang="scss" scoped></style>
