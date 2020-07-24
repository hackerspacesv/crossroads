import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import './registerServiceWorker'

// Views
import LoginForm from './components/LoginForm.vue'
import StoreTweet from './components/StoreTweet.vue'


Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)

Vue.use(VueMaterial)

Vue.config.productionTip = false

const routes = [
  { path: '/login', component: LoginForm },
  { path: '/report', component: StoreTweet }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})


new Vue({
  router
}).$mount('#app')
