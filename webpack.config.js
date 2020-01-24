const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => ({
  entry: './src/js/index.js',

  output: {
    path: path.resolve('dist'),
    filename: 'index.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: options.mode === 'development' }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: options.mode === 'development',
              plugins: function() {
                return [require('autoprefixer')]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: options.mode === 'development',
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      }
    ]
  },
  devtool: options.mode === 'development' ? 'source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyWebpackPlugin([{ from: 'src/img', to: 'img' }])
  ],

  devServer: {
    stats: {
      children: false,
      maxModules: 0
    },
    overlay: true
  }
})
