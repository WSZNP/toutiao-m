<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <template #title>
        <div class="title-text">我的频道</div>
      </template>
      <!-- 默认插槽,可以不用设置slot -->
      <van-button class="edit-btn" @click="isEdit=!isEdit" type="danger" plain round size="mini">
        {{isEdit?'完成':'编辑'}}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel,index) in myChannels" :key="index"
        @click="onMyChannelClick(channel,index)">
        <template #icon>
          <van-icon v-show="isEdit&&!fiexChannels.includes(channel.id)" name="clear"></van-icon>
          <!-- 数组的includes方法返回一个布尔值，来判断是否包含该元素 -->
        </template>
        <template #text>
          <span class="text" :class="{active:index===active}">{{channel.name}}</span>
          <!-- 因为列表名字渲染顺序两个地方一摸一样,因此首页页面的active值和弹出框页面的index值代表的内容和顺序一摸一样，所以可以这样判断，index===active -->
        </template>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <template #title>
        <div class="title-text">频道推荐</div>
      </template>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item class="grid-item" v-for="channel in recommendChannels" :key="channel.id" :text="channel.name"
        icon="plus" @click="onAddChannel(channel)" />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/store/storage'
export default {
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0]// 固定频道不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // filter:“过滤”功能，数组中的每一项运行给定函数，返回满足过滤条件组成的数组。
      return this.allChannels.filter(channel => {
        // find:遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }
  },
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口，放到线上
        try {
          await addUserChannels({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据储存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fiexChannels.includes(channel.id)) {
          // 1. 如果是固定频道则不删除
          return
        }
        // 2. 编辑状态，执行删除频道
        this.myChannels.splice(index, 1)
        // 3. 让激活频道的索引-1
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        // 4. 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannels(channel.id)
        } else {
          // 将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  :deep(.grid-item) {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: unset;
      }
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  :deep(.my-grid) {
    .grid-item {
      .active {
        color: red;
      }
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  :deep(.recommend-grid) {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
