import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Findgame from '../components/Findgame.vue'
import Profile from '../components/Profile.vue'
import Gamelist from '../components/Gamelist.vue' // Import Gamelist
import Admin from '../components/Admin.vue'; // Import Admin

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/find', name: 'Findgame', component: Findgame },
  { path: '/profile/:username', name: 'Profile', component: Profile },
  { path: '/gamelist', name: 'Gamelist', component: Gamelist }, // Add route for Gamelist
  { path: '/admin', name: 'Admin', component: Admin } // Add route for Admin
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check if the user is logged in
router.beforeEach(async (to, from, next) => {
  const publicPages = ['Home', 'Login', 'Register'];
  const authRequired = !publicPages.includes(to.name);
  const user = JSON.parse(localStorage.getItem('user'));

  if (authRequired && !user) {
    alert('You must be logged in to access this page.');
    return next({ name: 'Login' });
  }

  if (to.name === 'Admin') {
    try {
      const response = await fetch(`http://localhost:5001/is-admin/${user.id_user}`);
      const data = await response.json();
      if (!data.isAdmin) {
        alert('You do not have access to this page.');
        return next({ name: 'Home' });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      alert('Failed to verify admin access.');
      return next({ name: 'Home' });
    }
  }

  next();
});

export default router
