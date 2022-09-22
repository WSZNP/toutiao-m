<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel"
        background="#3296fa" @focus="isResultShow=false" />
    </form>
    <!-- 顶部搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text='searchText'></search-result>
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text='searchText' @search='onSearch'></search-suggestion>
    <!-- 联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else :search-histories='searchHistory' @clear-search-histories='searchHistory=[]'
      @search='onSearch'>
    </search-history>
    <!-- 搜索历史记录 -->

  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/store/storage'
export default {
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistory: getItem('TOUTIAO_SEARCH_HISTORIES') || []// 搜索的历史记录数据
    }
  },
  name: 'SearchIndex',
  props: {},
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  watch: {
    searchHistory (newVal) {
      setItem('TOUTIAO_SEARCH_HISTORIES', newVal)
    }
    // searchHistory: {
    //   handler (newVal) { }
    // }
  },
  computed: {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史纪录
      // 要求：不要有重复历史记录，最新的排在最前面
      const index = this.searchHistory.indexOf(val)
      if (index !== -1) {
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
</style>
