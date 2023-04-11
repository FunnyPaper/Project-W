const path = require('path');
const common = require('./webpack.config.common');

module.exports = {
	...common,
	devtool: 'inline-source-map',
	mode: 'development',
	devServer: {
		static: path.join(__dirname, 'dist'),
		port: 3000,
	},
};
