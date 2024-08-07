<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from '@/router/index'
import { routes } from 'vue-router/auto-routes'

const getRouterList = () => {
  let routerList = []
  for (const iterator of router.getRoutes()) {
    if (iterator.name != '' && iterator.name != 'Homeview') {
      routerList.push(iterator)
    }
  }
  return routerList
}
</script>

<template>
  <div class="content">
    <header>
      <RouterLink to="/" class="homeBtn">Home</RouterLink>
    </header>
    <main>
      <aside>
        <div
          v-for="routers in getRouterList()"
          @click="router.push(routers.name)"
          class="routerBox"
        >
          {{ routers.name }}
        </div>
      </aside>
      <RouterView class="left" />
    </main>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  flex-direction: column;
  header {
    height: 10vh;
    width: 100%;
    .homeBtn {
      height: 100%;
      width: 100%;
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      background-color: rgb(124, 174, 205);
      text-decoration: none !important;
    }
  }
  main {
    display: flex;
    flex-direction: row-reverse;
    flex: 3;
    .left {
      flex: 3;
    }
    aside {
      width: 15vw;
      display: flex;
      flex-direction: column;
      gap: 3vh;
      .routerBox {
        height: 5vh;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        background-color: antiquewhite;
        cursor: pointer;
      }
    }
  }
}
</style>
