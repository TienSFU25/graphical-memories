import * as webpack from 'webpack';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    // 'webpack-hot-middleware=client?reload=true', //note that it reloads the page if hot module reloading fails.
    './src/index.tsx'
  ],
  target: 'web',
  output: {
    path: '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: './src', loaders: ['babel-loader?presets[]=es2015']},
      {test: /\.tsx?$/, loader: 'babel-loader?presets[]=react!ts-loader'},
      {test: /(\.css)$/, loaders: ['style', 'css']},
      {test: /(\.scss)$/, loaders: ['style', 'css', 'sass']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.(png|jpg)$/, loader: 'url?limit=10000'},
      {test: /\.csv$/, loader: 'dsv-loader'}
    ]
  }
};
