import type { AxiosInstance } from 'axios'

let httpClient: AxiosInstance | null = null

export function setHttp(http: AxiosInstance) { httpClient = http }
export function getHttp(): AxiosInstance | null { return httpClient }

