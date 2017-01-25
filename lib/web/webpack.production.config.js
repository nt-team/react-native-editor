
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	exclude: /(node_modules|bower_components|dist)/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	exclude: /(node_modules|bower_components|dist)/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css')
});

module.exports = {
	entry: [
		'./src/index.ts'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'RNEditor.bundle.js'
	},
	resolve: {
		extensions: ['', '.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('RNEditor.css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: './src/template.html',
			inlineSource: '.(js|css)$',
			filename: path.join(__dirname, 'dist', 'RNEditor.html'),
		}),
		new HtmlWebpackInlineSourcePlugin(),
		new webpack.optimize.DedupePlugin()
	]
};
