<template>
  <van-button v-if="isFollowed" class="follow-btn" round size="small" @click="onFollow" :loading='loading'>已关注
  </van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow"
    :loading='loading'>关注
  </van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  data () {
    return {
      loading: false
    }
  },
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed'// 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    async onFollow () {
      this.loading = true// 展示关注按钮的loading状态
      try {
        if (this.isFollowed) {
          // 已关注,取消关注
          await deleteFollow(this.userId)
          // this.isFollowed = false
        } else {
          //  没有关注，添加关注
          await addFollow(this.userId)
          // this.isFollowed = true
        }
        // 更新视图状态
        // this.$emit('update-is-follow', !this.isFollowed)
        // this.$emit('input', !this.isFollowed)
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '无法关注自己！'
        }
        this.$toast(message)
      }
      this.loading = false// 关闭关注按钮的loading状态
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
