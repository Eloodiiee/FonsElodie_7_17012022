import Vue from "vue" // package name in npm
import VueRouter from "vue-router"

import Login from "./views/Login.vue"
import Signup from "./views/Signup.vue"
import Profile from "./views/Profile.vue"
import Wall from './views/Wall.vue'
import Post from './views/WallPost.vue'

Vue.use(VueRouter);
const mode = 'history' // way to shorthen the path and make them readable
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