<template>
  <van-icon @click="onCollect" :color="value===1 ? '#e56f45' : '#777'" :name="value===1 ? 'good-job' : 'good-job-o'" />
</template>

<script>
import { addLicked, deleteLicked } from '@/api/article'
export default {
  name: 'LikeArticle',
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    async onCollect () {
      try {
        let status = -1
        if (this.value === 1) {
          await deleteLicked(this.articleId)
        } else {
          await addLicked({
            target: this.articleId
          })
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('点赞失败')
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
