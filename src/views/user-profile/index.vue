<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" class="page-nav-bar">
      <template #left>
        <van-icon name="arrow-left" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- 导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange">

    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <template>
        <van-image class="avatar" :src="user.photo" fit="cover" round />
      </template>
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true"></van-cell>
    <van-cell title="性别" :value="user.gender===0 ? '男' : '女'" is-link @click="isUpdateGenderShow=true"></van-cell>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow=true"></van-cell>
    <!-- 个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" style="height:100%">
      <update-name @close='isUpdateNameShow=false' v-model="user.name" v-if="isUpdateNameShow"></update-name>
    </van-popup>
    <!-- 编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close='isUpdateGenderShow=false'></update-gender>
    </van-popup>
    <!-- 编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday v-model="user.birthday" v-if="isUpdateBirthdayShow" @close='isUpdateBirthdayShow=false'>
      </update-birthday>
    </van-popup>
    <!-- 编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%">
      <update-photo :img="img" @close='isUpdatePhotoShow=false' @update-photo='user.photo=$event'
        v-if="isUpdatePhotoShow"></update-photo>
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, // 用户个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null// 预览的图片
    }
  },
  props: {},
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  watch: {},
  computed: {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户信息失败')
      }
    },
    onFileChange () {
      //  获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      const data = window.URL.createObjectURL(file)
      this.img = data
      this.isUpdatePhotoShow = true

      // file-input 如果选择了同一个图片，不会触发change事件
      // 解决办法就是每次使用完毕把它的value清空
      this.$refs.file.value = ''
    }
  },
  created () {
    this.loadUserProfile()
  },
  mounted () { }
}
</script>
<style lang="less" scoped>
.user-profile {
  .van-icon-arrow-left {
    color: #fff;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
