const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
  entry: [
    "./index.js",
    "webpack-hot-middleware/client"
  ],
  loaders: [
    {
      test: /\.jsx?$/, //what files to run through loaders
      include: path.join(__dirname, 'src'), //where files are coming from
      exclude: /node_modules/,
      loaders: ["babel-loader"] //loaders you run files through
    }
  ],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    /*
      We are setting an API_HOST variable that will replace having to hardcode use localhost
      for api requests. Webpack will replace any instance of API_HOST with either the production url
      or the development url automatically. We don't have to switch it for production/development
      it will happen automatically via webpack!
      e.g. ajax request: `$(API_HOST)/api/cats`
    */
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'API_HOST': 'http://localhost:3000'
      }
    })
  ]
};
