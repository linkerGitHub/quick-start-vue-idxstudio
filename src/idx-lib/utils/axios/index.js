import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import router from '@/router'
import config from './config'

const Axios = axios.create(config)

// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'post' || config.method === 'put'
    ) {
      // 序列化
      config.data = qs.stringify(config.data)
    }

    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    // 这里localStorage一般是请求成功后我们自行写入到本地的,因为你放在vuex刷新就没了
    // 一些必要的数据写入本地,优先从本地读取
    if (localStorage.loginUserBaseInfo) {
      config.headers.Authorization = JSON.parse(localStorage.loginUserBaseInfo).token
    }
    return config
  },
  error => {
    // error 的回调信息,看贵公司的定义
    Message({
      //  饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: error && error.data.error.message,
      type: 'error'
    })
    return Promise.reject(error.data.error.message)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    if (!res.data.status) {
      Message({
        //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: '[' + res.data.code + ']' + res.data.error,
        type: 'error'
      })
      return Promise.reject(res.data.error)
    }
    return res
  },
  error => {
    console.log()
    // 对响应数据做些事
    if (!error.response.data.status) {
      Message({
        //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: '[' + error.response.data.code + ']' + error.response.data.error,
        type: 'error'
      })
    }

    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
    // 直接丢localStorage或者sessionStorage
    if (!window.localStorage.getItem('loginUserBaseInfo')) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({
        path: '/Login'
      })
    } else {
      // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
      if (error.response.status === 401) {
        router.push({
          path: '/error/401'
        })
      }
      if (error.response.status === 403) {
        router.push({
          path: '/error/403'
        })
      }
      if (error.response.status === 500) {
        router.push({
          path: '/error/500'
        })
      }
      if (error.response.status === 502) {
        router.push({
          path: '/error/502'
        })
      }
      if (error.response.status === 404) {
        router.push({
          path: '/error/404'
        })
      }
    }
    // 返回 response 里的错误信息
    let errorInfo = error.response.data.error ? error.response.data.error : error.response.data.data.message
    return Promise.reject(errorInfo)
  }
)
export {
  Axios
}
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}
