import { url } from '@/idx-lib/config'

export default {
  baseURL: url.server.api_base, // 因为我本地做了反向代理
  timeout: 10000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}
