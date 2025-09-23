import axios, { type AxiosResponse } from 'axios'

export const client = axios.create({
  baseURL: '/api',
})

client.defaults.withCredentials = true

client.interceptors.response.use((res: AxiosResponse) => res.data)
client.defaults.withCredentials = true
