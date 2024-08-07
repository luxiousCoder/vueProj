<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import { useViewsInfoStore } from '@/stores/index'

const counter = useViewsInfoStore()

const loadviews = (routerName: any) => {
  router.push(routerName)
}
</script>

<template>
  <div class="home">
    <div
      class="routerbox"
      v-for="page in counter.PageInfo"
      :key="page.layer"
      @click="loadviews(page.name)"
    >
      {{ page.name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  .routerbox {
    height: 20vh;
    width: 10vw;
    flex: auto;
    padding-top: 10vh;
    text-align: center;
    box-sizing: border-box;
    font-size: 1.3vw;
    background-color: aquamarine;
    padding-bottom: 4vh;
    margin-bottom: 2vw;
    display: inline-block;
    margin-left: 10vw;
    margin-top: 2vh;
    cursor: pointer;
  }
}
</style>
