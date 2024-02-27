import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Help from '../pages/Help.vue'
import Get from '../pages/Get.vue'
import Put from '../pages/Put.vue'
import Contacts from '../pages/Contacts.vue'
import Tx from '../pages/Tx.vue'
import Qr from '../pages/Qr.vue'
import Global from '../pages/Global.vue'
import Settings from '../pages/Settings.vue'
import User from '../pages/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/get', component: Get },
  { path: '/put', component: Put },
  { path: '/help', component: Help },
  { path: '/contacts', component: Contacts },
  { path: '/tx', component: Tx },
  { path: '/qr', component: Qr },
  { path: '/global', component: Global },
  { path: '/settings', component: Settings },
  { path: '/user/:id', component: User, name: 'user' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
