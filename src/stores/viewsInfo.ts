import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewsInfoStore = defineStore('viewsInfo', () => {
  const PageInfo = ref([
    { name: 'Componenttest', layer: 1 },
    { name: 'Homeview', layer: 2 },
    { name: 'Threeviews', layer: 3 },
    { name: 'Wstest', layer: 4 },
  ])

  return { PageInfo }
})
