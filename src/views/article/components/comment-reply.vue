<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <template #left>
        <van-icon name="cross" @click="$emit('close')" />
      </template>
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment='comment'></comment-item>
      <!-- 当前评论项 -->

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <comment-list :list="CommentList" :source="comment.com_id" type="c"></comment-list>
      <!-- 评论的回复列表 -->
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow=true">写评论</van-button>
    </div>
    <!-- 发布评论 -->
    <!-- 评论输入框 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success='onPostSuccess'></comment-post>
    </van-popup>
    <!-- 评论输入框 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  data () {
    return {
      isPostShow: false,
      CommentList: [] // 评论的回复列表
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  watch: {},
  computed: {},
  methods: {
    onPostSuccess (data) {
      // 更新回复数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复内容展示到列表顶部
      this.CommentList.unshift(data.new_obj)
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
