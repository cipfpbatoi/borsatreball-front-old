import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'
import Ofertas from '../views/Ofertas.vue'
import Alumnos from '../views/Alumnos.vue'
import Empresas from '../views/Empresas.vue'
import Ciclos from '../views/Ciclos.vue'
import Responsables from '../views/Responsables.vue'
import MenuManager from '../views/MenuManager.vue'
import Privacitat from '../views/Privacitat.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Register,
  },
  {
    path: '/ofertas',
    name: 'Ofertas',
    component: Ofertas,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/ofertas-arxiu',
    name: 'OfertasArxiu',
    component: Ofertas,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/alumnos',
    name: 'Alumnos',
    component: Alumnos,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/empresas',
    name: 'Empresas',
    component: Empresas,
    meta: {
      requireAuth: true,
    },
  }, {
    path: '/ciclos',
    name: 'Ciclos',
    component: Ciclos,
    meta: {
      requireAuth: true,
    },
  }, {
    path: '/responsables',
    name: 'Responsables',
    component: Responsables,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/notfound',
    name: '404',
    component: NotFound,
  }, {
    path: '/menu',
    name: 'menuManager',
    component: MenuManager,
    meta: {
      requireAuth: true,
    },
  }, {
    path: '/privacitat',
    name: 'Privacitat',
    component: Privacitat,
  }, {
    path: '*',
    redirect: {
      name: '404',
    },
  }, {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user.access_token) {
      next();
    }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})

export default router
