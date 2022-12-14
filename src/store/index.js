import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from './storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息，里面包含token等数据
    // user: null
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止刷新丢失，我们需要把数据备份到本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
