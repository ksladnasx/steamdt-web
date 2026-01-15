// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import SkinSearch from '@/views/SkinSearch.vue'

const routes = [
  {
    path: '/',
    name: 'SkinSearch',
    component: SkinSearch
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router