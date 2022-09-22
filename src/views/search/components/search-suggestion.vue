<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text,index) in suggestions" :key="index" @click="$emit('search',text)">
      <template #title>
        <div v-html="highlight(text)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

// 按需加载有好处，只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  watch: {
    searchText: {
      // searchText发生改变，就会调用handler函数
      // debounce函数
      // 参数1 一个函数
      // 参数2 延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (newVal) {
        this.loadSearchSuggestions(newVal)
      }, 300),
      // handler (newVal) {
      //   this.loadSearchSuggestions(newVal)
      // },
      immediate: true // 立即侦听
    }
  },
  computed: {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions({
          q
        })
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则//中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      // RegExp正则表达式的构造函数
      // 参数1 匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2 匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.search-suggestion {
  :deep(span.active) {
    color: #3296fa;
  }
}
</style>
