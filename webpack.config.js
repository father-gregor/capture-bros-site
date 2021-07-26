const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const clientConfig = require('./config/client.json');

function flatten (object, path = null, separator = '.') {
    return Object.keys(object).reduce((acc, key) => {
        const value = object[key];
        const newPath = [path, key].filter(Boolean).join(separator);
        const isObject = [
            typeof value === 'object',
            value !== null,
            !(value instanceof Date),
            !(value instanceof RegExp),
            !(Array.isArray(value) && value.length === 0),
        ].every(Boolean);

        return isObject
            ? {...acc, ...flatten(value, newPath, separator)}
            : {...acc, [newPath]: value};
    }, {});
}

function flattenConfig (object) {
    const flatObj = flatten(object);
    for (let key of Object.keys(flatObj)) {
        flatObj[`config.${key}`] = JSON.stringify(flatObj[key]);
        delete flatObj[key];
    }
    return flatObj;
}

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
            filename: `./js/bundle.[contenthash]${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
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
                                        require('tailwindcss'),
                                        require('autoprefixer')
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
                ENV: JSON.stringify(options.mode),
                ...flattenConfig(clientConfig)
            }),
            new HtmlWebpackPlugin({
                template: '!!underscore-template-loader!./src/client/html/views/index.html',
                templateParameters: {
                    config: clientConfig
                },
                cache: false,
                inject: 'body',
                scriptLoading: 'defer',
                minify: process.env.NODE_ENV === 'development' ? false : {
                    collapseWhitespace: false
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: './src/client/favicon', to: './public/favicon'},
                    {from: './src/client/img', to: './public/img'}
                ]
            }),
            new ExtraWatchWebpackPlugin({
                files: ['./config/client.json'],
            }),
            new CleanWebpackPlugin({})
        ],
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                }),
                new CssMinimizerPlugin(),
            ],
        },
    };
};
