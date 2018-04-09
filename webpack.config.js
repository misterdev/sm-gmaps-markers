const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: './src/index.js',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
    },
    plugins: [
        new Dotenv(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'SM Maps Markers',
            template: './src/index.ejs'
        })
    ],
    module: {
        rules: [{
            test: /\.json$/,
            use: {
                loader: 'json-loader'
            }
        }, {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug: true,
                    },
                },
            ],
        }]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')]
    },
    node: {
        fs: 'empty'
    }
};