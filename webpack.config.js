const path              = require('path');
const webpack           = require('webpack');
const htmlPlugin        = require('html-webpack-plugin');
const openBrowserPlugin = require('open-browser-webpack-plugin'); 
const dashboardPlugin   = require('webpack-dashboard/plugin');
const autoprefixer      = require('autoprefixer'); 
const PROD              = 1;

const PATHS = {
  app: path.join(__dirname, 'src/'),
  images:path.join(__dirname,'src/assets/'),
  build: path.join(__dirname, 'public/javascripts/')
};

const options = {
  host:'localhost',
  port:'3000'
};

var HTMLWebpackPluginConfig = new htmlPlugin ({
        template: __dirname + '/views/partials/header.mustache',
        filename: 'header.mustache',
        inject: 'body'
});


module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'script.min.js'
  },
  devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port 
    },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ],
		include:PATHS.app
      },
      
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,        
        loader: 'file',
        query: {
          name: '[path][name].[ext]'
        }
      },      
    ]
  },
  postcss: () => {
    return [
      require('precss'),
      require('autoprefixer')
    ];
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    HTMLWebpackPluginConfig
  ] : []
};
