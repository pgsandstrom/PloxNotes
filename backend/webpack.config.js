const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const serverConfig = {
  entry: ['./src/index.js'],
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['airbnb'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ['isomorphic-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'isomorphic-style-loader' }, { loader: 'css-loader' }], // TODO skriv denna snyggare pa alla stallen
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const clientConfig = {
  devtool: 'source-map',
  entry: ['whatwg-fetch', 'babel-polyfill', './client/src/'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'public/client.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['airbnb'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader',
      },
      { test: /\.(jpg|png)$/, use: 'url-loader?limit=25000' },
    ],
  },
  plugins: [
    // Make react understand we are in production mode
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // this makes webpacks -p flag redundant. Optimizes and minimizes
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

module.exports = [serverConfig, clientConfig];
