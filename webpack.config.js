var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Maps',
            template: './src/index.ejs'
        })
    ],
    module: {
        rules: [{
            test: /\.json$/,
            use: {
                loader: 'json-loader'
            }
        }]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')]
    }
};