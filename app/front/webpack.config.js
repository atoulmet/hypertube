'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
    devServer: {
        historyApiFallback: true
    },
    entry: [ './index.js' ],
    module: {
        loaders: [
            { test: /\.js$/, loader: [ 'babel-loader' ], exclude: /node_modules/ },
            { test: /\.jsx$/, loader: [ 'babel-loader' ], exclude: /node_modules/ },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ 'css-loader', 'sass-loader' ]
                })
            },
        ]
    },
    output: {
        crossOriginLoading: 'anonymous',
        filename: './bundle.js',
        path: path.resolve('dist'),
        publicPath: '/'
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.NamedModulesPlugin()
    ]
}