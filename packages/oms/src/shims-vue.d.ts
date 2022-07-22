import 'vue'
import { AxiosInstance } from 'axios'
import { Message } from 'element-plus'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare global {
  interface Window {
    App: any;
    OmsOptions: any;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: AxiosInstance
    $message: Message
    formData: Record<string, any>
  }
}
