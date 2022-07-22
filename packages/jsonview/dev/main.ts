import { createApp } from 'vue'
import Dev from './serve.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import JsonView from '../src'

const app = createApp(Dev)
app.use(ElementPlus).mount('#app')
