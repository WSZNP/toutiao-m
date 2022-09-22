module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // quotes: [1, 'single'], // 字符串使用单引号
    // semi: [1, 'never'], //  末尾不加分号
    // 'prettier/prettier': 'off' // 防止终端中因为规则问题报警告,所以关闭
    'vue/comment-directive': 'off',
    'space-before-function-paren': 0,
    'vue/multi-word-component-names': 'off',
    'prefer-const': 0
  }
}
