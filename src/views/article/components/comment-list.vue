<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载"
    @load="onLoad" :immediate-check='false'>
    <comment-item v-for="(item,index) in list" :key="index" :comment='item'
      @reply-click="$emit('reply-click',$event)" />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 用来获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义prop数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  components: {
    CommentItem
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型, 只能是'a'或'c', 'a'代表对文章的评论列表, 'c'代表对评论的回复列表
          source: this.source.toString(), // 文章id或评论id, 如果type为'a'这里传递文章id, 如果type为'c'这里传评论id
          offset: this.offset, // 偏移量id(评论id), 值为评论id, 偏移量, 表示告诉后台从此id往后返回数据给前端, 做加载更多效果
          limit: this.limit // 获取评论数量, 不传, 默认后台返回10条
        })
        // if (Math.random() > 0.9) {
        //   JSON.parse('jjjjj')
        // }
        // 2.将数据添加到列表中
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        // 3.将loading关闭
        this.loading = false
        // 4.判断是否还有数据，有就更新获取下一页的数据页码
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          // 没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  },
  created () {
    // 当手动初始onLoad的话，不会自动开启初始的loading
    // 所以要手动开启初始loading
    this.loading = true
    this.onLoad()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
