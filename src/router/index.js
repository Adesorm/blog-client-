import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import BlogDetails from '../views/BlogDetails.vue'
import CreateBlog from '../views/CreateBlog.vue'
import EditBlog from '../views/EditBlog.vue'
import Profile from '../views/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/register',
      name: 'register',
      component: Register
    },

    {
      path: '/blog/:id',
      name: 'blog-details',
      component: BlogDetails
    },

    {
      path: '/create-blog',
      name: 'create-blog',
      component: CreateBlog,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/edit-blog/:id',
      name: 'edit-blog',
      component: EditBlog,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})


/*
  Navigation Guard
*/

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('access')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }

})


export default router