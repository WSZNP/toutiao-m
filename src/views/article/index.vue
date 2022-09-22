<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <template #left>
        <van-icon name="arrow-left" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <!-- 关注按钮组件 -->
          <!-- 模板中的$event是事件参数 -->
          <!-- 当传递给子组件的数据既要使用又要修改 -->
          <!-- 传递：props
          :is-followed='article.is_followed'
          修改:自定义事件
          @update-is-follow='article.is_followed=$event'
          简写方式就是在组件上使用v-model
          value='article.is_followed'
          imput='article.is_followed=$event'

          如果需要修改v-model的规则名称可以通过子组件的model属性来配置修改

          一个组件上只能使用一次v-model
          如果有多个数据需要实现类似的v-model效果
          可以使用属性的.sync修饰符
           -->
          <follow-user v-model="article.is_followed" :user-id='article.aut_id' class="follow-btn"></follow-user>
          <!-- 关注按钮组件 -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章的评论列表 -->
        <comment-list :source='article.art_id' :list="commentList"
          @onload-success='totalCommentCount=$event.total_count' @reply-click='onReplyClick'></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow=true">写评论</van-button>
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <collect-article :article-id='article.art_id' v-model="article.is_collected"></collect-article>
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article :article-id='article.art_id' v-model="article.attitude"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target='article.art_id' @post-success='onPostSuccess'></comment-post>
        </van-popup>
        <!-- 评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染，只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:100%">
      <!-- v-if条件渲染，会移除DOM节点，而不是隐藏或者显示 -->
      <comment-reply v-if="isReplyShow" :comment='currentComment' @close='isReplyShow=false'></comment-reply>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/lick-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 起始位置
//   startPosition: 0,
//   onClose () {
//     // 关闭的时候触发的函数
//     this.$toast('关闭')
//   }
// })
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有后代组件提供数据
  provide () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 处理失败的状态码
      // followLoading: false
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论弹出层显示状态
      commentList: [], // 评论列表
      isReplyShow: false, // 回复弹出层
      currentComment: {}// 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdasdasdas')
        // }
        console.log(data)
        // 数据驱动视图不是立即的
        this.article = data.data

        // 初始化图片点击预览
        // console.log(this.$refs.articleContent)
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        }, 0)

        // 请求成功，关闭loading
        // this.loading = false
      } catch (err) {
        // this.loading = false
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取数据失败', err)
      }
      // 无论成功还是失败，都要关闭loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的image节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.addEventListener('click', function () {
          ImagePreview({
            // 预览的图片地址
            images,
            // 起始位置
            startPosition: index
          })
        })
      })
      // console.log(images)
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  :deep(.van-icon-arrow-left) {
    color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
