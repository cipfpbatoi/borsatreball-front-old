import Vue from 'vue'
import VueRouter from 'vue-router'
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

const ifNotAuthenticated = (to, from, next) => {
  if (to === from) {
    return
  }
  if (!localStorage.getItem('user')) {
    next()
    return
  }
  alert('Debes desloguearte primero');
  next('/')
}
const ifAuthenticated = (to, from, next) => {
  if (to === from) {
    return
  }
  if (localStorage.getItem('user')) {
    next()
    return
  }
  next('/login')
}

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
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/ofertas',
    name: 'Ofertas',
    component: Ofertas,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/ofertas-arxiu',
    name: 'Ofertas',
    component: Ofertas,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/alumnos',
    name: 'Alumnos',
    component: Alumnos,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/empresas',
    name: 'Empresas',
    component: Empresas,
    beforeEnter: ifAuthenticated,
  },{
    path: '/ciclos',
    name: 'Ciclos',
    component: Ciclos,
    beforeEnter: ifAuthenticated,
  },{
    path: '/responsables',
    name: 'Responsables',
    component: Responsables,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/notfound',
    name: '404',
    component: NotFound,
  }, {
    path: '/menu',
    name: 'menuManager',
    component: MenuManager,
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

export default router
