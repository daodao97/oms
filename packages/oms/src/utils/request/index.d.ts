import 'axios'

declare module 'axios' {
    // eslint-disable-next-line no-unused-vars
    export interface AxiosRequestConfig {
        cacheTime?: number
        notHoldApiErr?: boolean
    }
    export interface AxiosResponse<T = any> {
        code: number;
        data: T;
    }
}

