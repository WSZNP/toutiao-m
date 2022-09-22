<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="标题" left-arrow @click-left="$router.back()" />
    <!-- 导航栏 -->
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="base-info">
        <van-image class="avatar" width="80" height="80" fit="cover" round src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        <div class="right-area">
          <div class="stats-wrap">
            <div class="stats-item">
              <span class="count">66</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">66</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">66</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">66</span>
              <span class="text">发布</span>
            </div>
          </div>
          <van-button class="follow-btn">关注</van-button>
        </div>
      </div>
    </div>
    <div class="intro-wrap">
      <div>
        <span class="row1">认证：</span>
        <span class="row2">用户的认证信息</span>
      </div>
      <div>
        <span class="row1">简介：</span>
        <span class="row2">用户的简介信息</span>
      </div>
    </div>
    <!-- 用户信息 -->
  </div>
</template>

<script>
export default {
  name: 'UserPage',
  data () {
    return {
    }
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.user-container {
  .user-info {
    padding: 24px 30px 36px 30px;
    background-color: #fff;
    margin-bottom: 10px;

    .base-info {
      display: flex;
      .avatar {
        margin-right: 60px;
      }
      .right-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .stats-wrap {
          display: flex;
          justify-content: space-between;
          .stats-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .count {
              font-size: 26px;
              color: #0d0a10;
            }
            .text {
              font-size: 21px;
              color: #9c9b9d;
            }
          }
        }
        .follow-btn {
          position: relative;
          right: -50%;
          transform: translateX(-50%);
          margin-top: 33px;
          width: 289px;
          height: 55px;
          line-height: 55px;
          background-color: #6bb5ff;
          color: #fff;
          border: none;
        }
      }
    }
  }
  .intro-wrap {
    padding: 24px 30px 36px 30px;
    background-color: #fff;
    margin-bottom: 10px;
    .row1 {
      color: #686a73;
      font-size: 25px;
    }
    .row2 {
      color: #000;
      font-size: 25px;
    }
  }
  :deep(.van-icon-arrow-left) {
    color: #fff;
  }
}
</style>
