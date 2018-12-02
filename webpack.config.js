const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

/*  将样式提取到单独的css文件里，不用担心样式会被打包进js文件中  */
module.exports = {
  entry: {
    // 每个html文档只使用一个入口起点
    index: './src/js/index.js',
    // use for multiple pages
    // page2: './src/js/page2.js',
    // page3: './src/js/page3.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: 'static/js/[name]bundle.js',
    chunkFilename: 'static/js/[id].chunk.js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-withimg-loader',
      },
      {
        test: /\.json$/,
        loader: 'file-loader',
        options: {
          limit: 1,
        },
      },
      {
        test: /\.styl|css?$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!stylus-loader',
        }),
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env'],
          ],
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[ext]',
        },
      },
    ],
  },

  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './dist',
    host: 'localhost',
    inline: true,
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['index', 'myGallery', 'displayResult'],
      minChunks: 3,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJsPlugin(),
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({
      favicon: './src/imgs/favicon.ico',
      filename: './src/index.html',
      template: './src/index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
    // use for multiple pages
    // new HtmlWebpackPlugin({ //  根据模板插入css/js等生成最终HTML
    //   favicon: './src/imgs/favicon.ico', //  favicon路径，通过webpack引入同时可以生成hash值
    //   filename: './page2.html', // 生成的html存放路径，相对于path
    //   template: './page2.html', // html模板路径
    //   inject: true, // js插入的位置，true/'head'/'body'/false
    //   hash: true, // 为静态资源生成hash值
    //   chunks: ['vendors', 'myGallery'], // 需要引入的chunk，不配置就会引入所有页面的资源
    //   minify: { // 压缩HTML文件
    //     removeComments: true, // 移除HTML中的注释
    //     collapseWhitespace: false, // 删除空白符与换行符
    //   },
    // }),
    // new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
    //   favicon: './src/imgs/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
    //   filename: './displayResult.html', // 生成的html存放路径，相对于path
    //   template: './displayResult.html', // html模板路径
    //   inject: true, // js插入的位置，true/'head'/'body'/false
    //   hash: true, // 为静态资源生成hash值
    //   chunks: ['vendors', 'displayResult'], // 需要引入的chunk，不配置就会引入所有页面的资源
    //   minify: { // 压缩HTML文件
    //     removeComments: true, // 移除HTML中的注释
    //     collapseWhitespace: false, // 删除空白符与换行符
    //   },
    // }),
  ],
}
