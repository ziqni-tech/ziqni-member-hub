const { VueLoaderPlugin } = require('vue-loader');
const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = {
    entry: {
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                     'style-loader',
                     'css-loader',
                    {
                        loader: 'postcss-loader',

                        options: {
                            postcssOptions: {
                                plugins: () => [autoprefixer()],
                            }

                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
            },
            {
                test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name][contenthash:8].[ext]',
                    outputPath: '/img',
                    esModule: false,
                },
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
                                  template: path.resolve(__dirname, '../public', 'index.html'),
                                  favicon: './public/favicon.ico',
                              }),
    ],
    resolve: {
        alias: {
            '@':  path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.vue', '.json'],
        fallback: {
            'querystring': require.resolve('querystring-es3'),
            "url": require.resolve("url/")
        }
    },
    devServer: {
        historyApiFallback: true,
    },
};