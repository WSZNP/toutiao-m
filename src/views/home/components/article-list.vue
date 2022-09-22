<template>
  <div class="article-list" @scroll="scrolltop" ref="scroll">
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText"
      success-duration="1500">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error"
        error-text="请求失败，点击重新加载" @load="onLoad">
        <ArticleItem v-for="(article,index) in list" :key="index" :article="article"></ArticleItem>
        <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功', // 下拉刷新成功提示文本
      scroll: 0// 记录滚动条位置
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  activated () {
    this.$refs.scroll.scrollTop = this.scroll
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp || Date.now() // 时间戳,相当于页码
        })
        console.log(data)
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) { JSON.parse('saddasdasd') }
        // 2.把请求结果放到list数组中
        const { results } = data.data
        // 利用...数组展开操作符，会将数组一个一个拿出来
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        // loading关闭以后才能触发下一次的加载更多
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，把finished，设置为true，不再加载更多了
          this.finished = true
        }
      } catch (err) {
        // console.log('请求失败', err)
        // this.$toast('请求失败了')
        this.error = true
        // 请求失败了loading也得关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候会调用该函数
    async onRefresh () {
      try {
        // 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now() // 下拉刷每次请求获取最新数据,所以传入当前最新时间戳
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) { JSON.parse('saddasdasd') }
        // 将数据追加到列表顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 关闭下拉刷新的loading
        this.isreFreshLoading = false

        // 更新下拉刷新成功的文本
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    },
    // onLoad () {
    //     // 1.请求获取数据
    //     // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //     setTimeout(() => {
    //       // 2.把请求结果放到list数组中
    //       for (let i = 0; i < 10; i++) {
    //         this.list.push(this.list.length + 1)
    //       }

    //       // 3. 本次数据加载结束之后要把加载状态设置为结束
    //       // loading关闭以后才能触发下一次的加载更多
    //       this.loading = false

    //       // 4.判断数据是否全部加载完成
    //       if (this.list.length >= 40) {
    //         // 如果没有数据了，把finished设置为true,之后不再加载更多
    //         this.finished = true
    //       }
    //     }, 1000)
    //   }
    scrolltop () {
      let scrolltop = this.$refs.scroll.scrollTop
      this.scroll = scrolltop
    }
  }
}
</script>

<style  scoped lang='less'>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
