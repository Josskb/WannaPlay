import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Findgame from '../components/Findgame.vue' // Import Findgame component

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/register', name: 'Register', component: Register},
    {path: '/find', name: 'Findgame', component: Findgame} // Add route for Findgame
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;