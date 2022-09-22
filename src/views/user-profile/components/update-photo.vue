<template>
  <div class="update-photo">
    <img class="img" :src="img" alt="" ref="img">

    <div class="toobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  data () {
    return {
      cropper: null
    }
  },
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    onConfirm () {
      // console.log(this.cropper.getData())
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })

      try {
        // 错误的用法
        // 如果接口要求 Content-Type 为 application/json则传递普通js对象
        // updateUserPhoto({
        //   photo: blob
        // })

        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则你必须传递FormData对象
        const formData = new FormData()
        formData.append('photo', blob)

        const { data } = await updateUserPhoto(formData)
        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', data.data.photo)
        this.$toast.success('更新头像成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  },
  created () { },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    // console.log(cropper)
  }
}
</script>
<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toobar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
