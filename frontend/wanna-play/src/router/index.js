import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Findgame from '../components/Findgame.vue'
import Profile from '../components/Profile.vue'
import Gamelist from '../components/Gamelist.vue' // Import Gamelist

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/find', name: 'Findgame', component: Findgame },
  { path: '/profile/:username', name: 'Profile', component: Profile },
  { path: '/gamelist', name: 'Gamelist', component: Gamelist } // Add route for Gamelist
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check if the user is logged in
router.beforeEach((to, from, next) => {
  const publicPages = ['Home', 'Login', 'Register'];
  const authRequired = !publicPages.includes(to.name);
  const user = JSON.parse(localStorage.getItem('user'));

  if (authRequired && !user) {
    alert('You must be logged in to access this page.');
    return next({ name: 'Login' });
  }

  next();
});

export default router
