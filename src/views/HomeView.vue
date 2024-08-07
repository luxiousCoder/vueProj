<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useViewsInfoStore } from '@/stores/index'

const counter = useViewsInfoStore()

const loadviews = (routerName: any) => {
  router.push(routerName)
}

onMounted(() => {})
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .routerbox {
    height: 20vh;
    width: 10vw;
    margin-top: 5vh;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    font-size: 1.3vw;
    background-color: aquamarine;
    cursor: pointer;
  }
}
</style>
