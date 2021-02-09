const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const clientConfig = require('./config/client.json');

_.templateSettings.imports = {
    config: clientConfig,
};

module.exports = (env, options) => {
    return {
        entry: [
            './src/client/ts/index.ts',
            './src/client/scss/style.scss'
        ],
        output: {
            filename: './js/bundle.js',
            path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? 'dist' : 'distDev')
        },
        devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.html$/,
                    loader: 'underscore-template-loader',
                    query: {
                        engine: 'lodash',
                        withImports: true
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                postcssOptions: {
                                    plugins: [
                                        require('postcss-import'),
                                        require('tailwindcss')
                                    ]
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|svg|gif|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'public/img/'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'public/fonts/'
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify(options.mode)
            }),
            new HtmlWebpackPlugin({
                template: '!!underscore-template-loader!./src/client/html/views/index.html',
                templateParameters: {
                    config: clientConfig
                },
                cache: false
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: './src/client/favicon', to: './public/favicon'},
                    {from: './src/client/img', to: './public/img'},
                    {from: './src/client/fonts', to: './public/fonts'}
                ]
            }),
            new CleanWebpackPlugin({})
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
                new CssMinimizerPlugin(),
            ],
        },
    };
};
