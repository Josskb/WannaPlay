import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Findgame from '../components/Findgame.vue'
import Profile from '../components/Profile.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/find', name: 'Findgame', component: Findgame },
  { path: '/profile/:username', name: 'Profile', component: Profile }, // clé dynamique ici
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
