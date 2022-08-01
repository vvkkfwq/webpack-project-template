module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    // 使用airbnb规范时会提示eslint应在依赖中而不是开发依赖中，下面以禁用警告
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }, '**/webpack.*.js'],
  },
};
