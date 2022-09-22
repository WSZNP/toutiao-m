<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template>
        <div v-if="isDeleteShow">
          <span @click="$emit('clear-search-histories')">全部删除</span>
          &nbsp;
          <span @click="isDeleteShow=false">完成</span>
        </div>
        <van-icon v-else name="delete-o" @click="isDeleteShow=true" />
      </template>
    </van-cell>
    <van-cell :title="item" v-for="(item,index) in searchHistories" :key="index" @click="onSearchItemClick(item,index)">
      <template>
        <van-icon v-show="isDeleteShow" name="close" />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isDeleteShow: false// 控制删除显示状态
    }
  },
  name: 'SearchHistory',
  props: {
    // Prop数据
    // Prop数据是受父组件数据影响的
    // 如果是普通数据（数字，字符串，布尔值）绝对不能修改，即便改了也不会传导给父组件
    // 如果是引用类型数据（数组，对象）
    // 可以修改，例如[].push,对象.xxx=xxx
    // 但是不能重新赋值，例如xxx=[]
    searchHistories: {
      type: Array,
      required: true
    }
  },
  components: {},
  watch: {},
  computed: {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，进入搜索
        this.$emit('search', item)
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
