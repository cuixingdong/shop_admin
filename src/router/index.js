import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import Roles from '../views/Roles.vue'
import Rights from '../views/Rights.vue'
import Categories from '../views/Categories.vue'
import Goods from '../views/Goods.vue'
import GoodsAdd from '../views/GoodsAdd.vue'
import GoodsEdit from '../views/GoodsEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goodsadd',
        component: GoodsAdd
      },
      {
        path: '/goodsedit',
        component: GoodsEdit
      }

    ]
  }
]

const router = new VueRouter({
  routes

})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
