<template>
  <div class="update-gender">
    <van-picker title="标题" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="$emit('close')"
      :default-index="value" @change="onPickerChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true, // 禁止背景点击
        duration: 0
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层，提示成功
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新性别失败')
      }
    },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
