<script lang="ts" setup>
import { ref, watch } from 'vue'
import router from '@/router'
import DraggableCompounent from '@/components/draggableCompounent.vue'
import SliderBar from '@/components/sliderBar.vue'

</script>

<template>
  <!-- <div class="home">
    <div class="routerbox" @click="loadviews"></div>
    <div class="routerbox">
      {{ counter.testData }}
    </div>
    <el-select v-model="counter.testData" placeholder="Select" size="large" style="width: 240px">
      <el-option
        v-for="page in counter.PageInfo"
        :key="page.layer"
        :lable="page.name"
        :value="page.layer"
        @click="dataChage(page.name)"
      >
      </el-option>
    </el-select>
    <DraggableCompounent />
  </div> -->
  <!-- <div>{{ progressData }}</div>
  <SliderBar v-model="progressData" dragDirection="horizontal" class="qwww1"
    ><template v-slot:content>
      <p class="no-select">{{ progressData }}</p>
    </template></SliderBar
  >
  <SliderBar v-model="progressData" dragDirection="vertical" class="qwww" /> -->

  <!-- <div class="container1">
    <div class="container2"></div>
    <div class="container3"></div>
    <div class="container4"></div>
  </div> -->
</template>

<style lang="scss" scoped>
.container1{
  display: flex;
  background-color: bisque;
  height: 100vw;
  .container2{
    height: 20vh;
    width: 20vw;
    background-color: azure
  }
  .container3{
    position: relative;
    height: 20vh;
    width: 20vw;
    top: 20vh;
    background-color: rgb(30, 181, 181)
  }
  .container4{
    height: 20vh;
    width: 20vw;
    background-color: rgb(43, 80, 80)
  }
}
.home {
  .routerbox {
    background-color: aquamarine;
    padding-bottom: 4vh;
    margin-bottom: 2vw;
  }
}
.qwww {
  width: 100px;
  .draggable {
    width: 12px;
  }
}
.qwww1 {
  height: 100px;
}
.no-select {
  user-select: none; /* 不可选中的核心样式 */
  -webkit-user-select: none; /* 适用于Webkit内核的浏览器 */
  -moz-user-select: none; /* 适用于Mozilla内核的浏览器 */
  -ms-user-select: none; /* 适用于IE/Edge */
}
</style>
