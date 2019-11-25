import '@/assets/js/love.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  if (config.url !== 'login') {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  // console.log(response)
  return response.data
}, (error) => {
  return Promise.reject(error)
})

Vue.filter('time', value => {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
