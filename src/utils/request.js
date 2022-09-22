import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSONBig.parse() 把JSON格式的字符串转为js对象
// 使用的时候需要把BigNumber类型的数据转为字符串来使用
// JSONBig.stringify() 把js对象转为JSON格式字符串
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  // 自定义后端返回的原始数据
  // data后端返回的原始数据，json格式的字符串
  transformResponse: [
    function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
      // axios默认会这样处理后端返回的数据
      // return JSON.parse(data)
    }
  ]
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // cnfig：本次请求配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 这里务必要返回config配置对象，否则请求会停在这里出不去
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
export default request
