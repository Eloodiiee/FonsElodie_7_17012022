import Vue from "vue" 
import VueRouter from "vue-router"

import Login from "./views/Login.vue"
import Signup from "./views/Signup.vue"
import Profile from "./views/Profile.vue"
import Wall from './views/Wall.vue'
import Post from './views/WallPost.vue'

Vue.use(VueRouter);
const mode = 'history' //Permet de rendre les chemins plus courts et plus lisibles
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/Wall',
    name: 'Wall',
    component: Wall
  },
  {
    path: '/Post/:id',
    name: 'Post',
    component: Post
  },
  {
    path: '/Profile/:id',
    name: 'Profile',
    component: Profile
  }
];

const router = new VueRouter({
  routes, mode
});

export default router;