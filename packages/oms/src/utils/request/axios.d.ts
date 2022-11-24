import 'axios'

declare module 'axios' {
    export interface AxiosRequestConfig {
        cacheTime?: number
        notHoldApiErr?: boolean
        cacheEnable?: boolean
    }
    export interface AxiosResponse<T = any> {
        code: number;
        data: T;
    }
}

