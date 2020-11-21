import path from 'path'
import nodeExternals from 'webpack-node-externals'
import LoadablePlugin from '@loadable/webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'

import manifest from './manifest'

const PRODUCTION = process.env.NODE_ENV === 'production'
const BUILD_PATH = path.resolve(__dirname, 'build')
const DIST_PATH = path.resolve(__dirname, 'dist')

const getConfig = (target) => ({
  name: target,
  mode: PRODUCTION ? 'production' : 'development',
  target,
  entry: `./src/client/main-${target}.js`,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            caller: { target },
          },
        },
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: PRODUCTION ? '[contenthash:8].[ext]' : '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: !PRODUCTION,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !PRODUCTION,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !PRODUCTION,
              sassOptions: {
                includePaths: [
                  path.join(__dirname, 'src/client/styles'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  externals:
    target === 'node' ? [ '@loadable/component', nodeExternals() ] : undefined,
  output: {
    path: path.join(DIST_PATH, target),
    filename: PRODUCTION ? '[chunkhash:8].js' : '[name].[chunkhash:8].js',
    publicPath: `/dist/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },
  devtool: PRODUCTION ? '' : 'source-map',
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: PRODUCTION
        ? '[contenthash:8].css'
        : '[name].[contenthash:8].css',
    }),
    new WebpackPwaManifest(manifest),
    new CopyPlugin({
      patterns: [
        { from: './src/public', to: DIST_PATH },
      ].concat(
        PRODUCTION
          ? [
            { from: './config', to: path.join(BUILD_PATH, 'config') },
          ]
          : [],
      ),
    }),
  ],
})

export default [ getConfig('web'), getConfig('node') ]
