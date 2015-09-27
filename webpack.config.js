var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './main.js',
	output: {
		path: './build',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	extensions: ['js'],
	module: {
		loaders: [
			{ test: /\.less$/, loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap') },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('style!css') },
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'file-loader' }
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	],
	resolve: {
		modulesDirectories: ['node_modules', 'bower_components']
	}
};
