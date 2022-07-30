const path = require("path");
// 引入环境变量
const Dotenv = require('dotenv-webpack');
// 生成html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 分离包中的css代码
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 构建结果分析
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// 压缩css
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 内置压缩js插件
const TerserPlugin = require("terser-webpack-plugin");

console.log("process.env.NODE_ENV =", process.env.NODE_ENV); // 打印环境变量

module.exports = {
  // 入口
  entry: "./src/main.js",
  // 输出
  output: {
    // 输出文件名
    filename: 'assets/js/[name].bundle.js',
    path: path.join(__dirname, "dist"), // 输出文件目录
    clean: true, // 清理dist
  },
  // 配置映射关系
  devtool: "source-map",
  // 本地开发服务
  devServer: {
    // 本地端口号设置
    port: 8585,
    // 静态资源本地访问配置
    static: {
      directory: path.join(__dirname, "src/assets"),
      publicPath: "/src/assets", // 告告诉服务器在哪个 URL 上提供 static.directory 的内容
      watch: true,
    },
  },

  resolve: {
    // 配置别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  module: {
    // 转换规则
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 启用缓存(优化部分)
            },
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 css 文件
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ], // use: 对应的 Loader 名称
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: "asset",
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "assets/images/[name][hash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: "asset",
        generator: {
          // 输出文件位置以及文件名
          filename: "assets/fonts/[name][hash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过100kb不转 base64
          },
        },
      },
    ],
  },

  // 配置插件
  plugins: [
    new Dotenv({
      path:
        process.env.NODE_ENV === "development"
          ? "./.env.development"
          : "./.env.production",
      systemvars: true, // 允許讀取 process.env 下的任意系統變量
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/webpack.ico"
    }),
    new MiniCssExtractPlugin({
      filename: "assets/style/[name].[hash:8].css",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        // default: false,
        styles: {
          name: "chunk-styles",
          test: /\.(s?css|less|sass)$/,
          chunks: "all",
          enforce: true,
          priority: 10,
        },
        common: {
          name: "chunk-common",
          chunks: "all",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 2,
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      new TerserPlugin({}),
    ],
  },

  // cache 持久化缓存(优化)
  cache: {
    type: "filesystem",
  },
};
