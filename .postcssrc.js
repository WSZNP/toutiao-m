module.exports = {
  plugins: {
    // VUEcli内部已经配置了此插件，这里又配置了一次，所以冲突了
    // 'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 作用：把px转为rem
    'postcss-pxtorem': {
      // 根字号
      // rootValue: 37.5,
      // 查阅文档可知rootValue支持两种类型
      // 数字和函数
      // PostCSS处理每个CSS文件的时候都会来调用这个函数,他会把被处理的CSS文件相关的信息通过参数传递给该函数
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的css属性，*表示所有属性都要转换
      propList: ['*'],

      //排除不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
