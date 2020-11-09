import path from 'path'
import nodeExternals from 'webpack-node-externals'
import LoadablePlugin from '@loadable/webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'

import manifest from './manifest'

const DIST_PATH = path.resolve(__dirname, 'public/dist')
const production = process.env.NODE_ENV === 'production'

const getConfig = (target) => ({
  name: target,
  mode: production ? 'production' : 'development',
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
              name: production ? '[contenthash:8].[ext]' : '[path][name].[ext]',
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
              sourceMap: !production,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !production,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !production,
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
    filename: production ? '[chunkhash:8].js' : '[name].[chunkhash:8].js',
    publicPath: `/dist/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },
  devtool: 'source-map',
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: production
        ? '[contenthash:8].css'
        : '[name].[contenthash:8].css',
    }),
    new WebpackPwaManifest(manifest),
    new CopyPlugin({
      patterns: [
        { from: './src/public', to: DIST_PATH },
      ],
    }),
  ],
})

export default [ getConfig('web'), getConfig('node') ]
