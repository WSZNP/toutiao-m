<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
      error-text="请求失败，点击重新加载">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText// 查询关键词
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) { JSON.parse('saddasdasd') }
        console.log(data)
        // 2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据，如果有，则更新获取下一页数据的页码，如果没有，则将加载状态finished设置为结束
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true// 展示加载失败的提示状态
        this.loading = false// 加载失败loading也要关闭
        // this.$toast('数据获取失败，请稍后重试')
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
