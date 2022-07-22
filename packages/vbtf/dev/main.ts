import { createApp } from 'vue'
import Dev from './serve.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

import { RegComponents } from '@'
import { VForm } from '@'
RegComponents({ VForm })

const app = createApp(Dev)

const http = axios.create({
  baseURL: '/api'
})

http.interceptors.response.use(function(response) {
  return response.data
}, function(error) {
  return Promise.reject(error)
})
app.config.globalProperties.$http = http
app.use(ElementPlus).mount('#app')
