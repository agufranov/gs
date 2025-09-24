import axios, { type AxiosResponse } from 'axios'

export const client = axios.create({
  baseURL: '/api',
})

client.interceptors.response.use((res: AxiosResponse) => res.data)
