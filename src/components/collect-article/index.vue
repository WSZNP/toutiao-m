<template>
  <van-icon :loading='loading' @click="onCollect" :color="value ? '#ffa500' : '#777'"
    :name="value ? 'star' : 'star-o'" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
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
      this.loading = true
      try {
        if (this.value) {
          // 已收藏,取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，添加收藏
          await addCollect({
            target: this.articleId
          })
        }
        // 更新视图
        this.$emit('input', !this.value)

        this.$toast.success(this.value ? '取消收藏成功!' : '收藏成功!')
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
