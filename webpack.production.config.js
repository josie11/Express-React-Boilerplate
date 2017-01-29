const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
//this will copy index.html from src to dist/index.html upon any changes
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  //where reference to output file script will be injected
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  },
  inject: 'body'
});

module.exports = {
  devtool: 'source-map',

  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    //this stuff shrinks and simplifies code for production to reduce size of app
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }), //minify everything
    new webpack.optimize.DedupePlugin(), //dedupe similar code
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    //below serves gzipped version of bundle.js to browser to further reduce size
    //we also have middleware in our express server to make sure this gzipped version is served
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.jsx?$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    HTMLWebpackPluginConfig,
    /*
      We are setting an API_HOST variable that will replace having to hardcode use localhost
      for api requests. Webpack will replace any instance of API_HOST with either the production url
      or the development url automatically. We don't have to switch it for production/development
      it will happen automatically via webpack!
      e.g. ajax request: `$(API_HOST)/api/cats`
    */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_HOST: 'https://your-apps-name.herokuapp.com' //change this to your apps url
      }
    })
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
};

