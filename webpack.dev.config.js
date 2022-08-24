const path = require('path');
// 引入环境变量
const Dotenv = require('dotenv-webpack');
// 生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// vue加载器
const { VueLoaderPlugin } = require('vue-loader');
// ESlint-webpack插件
const ESLintPlugin = require('eslint-webpack-plugin');
// 在webpack中引入对于环境变量的使用
require('dotenv').config({ path: '.env.development' });

console.log('process.env.NODE_ENV =', process.env.NODE_ENV); // 打印环境变量

module.exports = {
  // 入口
  entry: './src/main.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'assets/js/[name].bundle.js',
    chunkFilename: 'assets/js/[name].js',
    path: path.join(__dirname, 'dist'), // 输出文件目录
    clean: true, // 清理dist
  },
  // 配置映射关系
  devtool: 'source-map',
  // 本地开发服务
  devServer: {
    // 本地端口号设置
    port: 8585,
    // 静态资源本地访问配置
    static: {
      directory: path.join(__dirname, 'src/assets'),
      publicPath: '/src/assets', // 告诉服务器在哪个 URL 上提供 static.directory 的内容
      watch: true,
    },
    proxy: {
      '/api': {
        target: process.env.LOCAL_API_URL,
        pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true,
      },
    },
  },

  resolve: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    // 转换规则
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 启用缓存(优化部分)
            },
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i, // 匹配所有的 css 文件
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ], // use: 对应的 Loader 名称
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: 'assets/images/[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, // 超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: 'assets/fonts/[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过100kb不转 base64
          },
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },

  // 配置插件
  plugins: [
    new Dotenv({
      path: './.env.development',
      systemvars: true, // 允許讀取 process.env 下的任意系統變量
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/webpack.ico',
    }),
    new VueLoaderPlugin(),
    new ESLintPlugin(),
  ],

  // cache 持久化缓存(优化)
  cache: {
    type: 'filesystem',
  },
};
