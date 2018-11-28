const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'mapviewer.constants': {
        'API_MAP_URL': JSON.stringify('http://localhost:1337/api/v1/maps/noauth'),
        'NODE_ZOOM_DEFAULT': JSON.stringify('16'),
        'NODE_LAT_DEFAULT': JSON.stringify('41.9537337'),
        'NODE_LON_DEFAULT': JSON.stringify('2.2332228')
      }
    })
  ],
  entry: {
    module: './src/modules/baseMap/baseMap.js',
    generalViewer: './src/viewers/general/general.js',
    nodeViewer: './src/viewers/nodeViewer/nodeViewer.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'guifimapviewer-[name].js'
  },
  devServer: {
    port: 5000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
           presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config;
