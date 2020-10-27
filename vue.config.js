const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    publicPath: process.env.VUE_APP_BASE_URL,
    outputDir: 'fingo-boss',
    devServer: {
        proxy: {
            'fingo': {
                target: 'https://temp.fingo.shop/'
            },
            'agent/back/proxystream': {
                // target: 'https://192.168.31.104:8081'
                // target: 'http://192.168.31.171:8081'
                target: 'https://back-dev.fingo.shop/'
                // target: 'https://back.fingo.shop/'
                // target: 'https://back-test.fingo.shop'
            },
            'api/proxyboss': {
                target: 'https://shg-dev.fingo.shop/'
            }
        },
        hot: false
    },
    css: {
        modules: false
    },
    configureWebpack: {
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号】
            filename: `js/[name].${process.env.VUE_APP_Version}.js`,
            chunkFilename: `js/[name].${process.env.VUE_APP_Version}.js`
        },
        // 修改打包后css文件名
        plugins: [
            new MiniCssExtractPlugin({
                filename: `css/[name].${process.env.VUE_APP_Version}.css`,
                chunkFilename: `css/[name].${process.env.VUE_APP_Version}.css`
            })
        ],
        optimization: {
            splitChunks: {
                minSize: 200000,
                maxSize: 650000,
                minChunks: 2,
                chunks: 'async',
                cacheGroups: {
                    node_vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 1
                    }
                }
            }
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                'moment$': 'moment/moment.js'
            },
            symlinks: false,
            extensions: ['*', '.js', '.vue', '.json'],
            modules: ['node_modules']
        },
        externals: {
            'vue': 'Vue',
            'vuetify': 'Vuetify',
            'vue-router': 'VueRouter',
            // 'element-ui': 'ELEMENT',
            'vuex': 'Vuex',
            'moment': 'moment',
            'axios': 'axios',
            'fingo-components': 'fingo-components'
        }
    },
    chainWebpack: config => {
        // 修改打包后img文件名
        // config.module
        //     .rule('images')
        //     .use('url-loader')
        //     .tap(options => {
        //         return {
        //             limit: 4096,
        //             fallback: {
        //                 loader: 'file-loader',
        //                 options: {
        //                     name: `img/[name].${process.env.VUE_APP_Version}.[ext]`
        //                 }
        //             }
        //         }
        //     })
        if (process.env.NODE_ENV === 'production') {
            // 清除css hash版本号
            config.plugin('extract-css').tap(args => [{
                filename: `css/[name].${process.env.VUE_APP_Version}.css`,
                chunkFilename: `css/[name].${process.env.VUE_APP_Version}.css`
            }])
        }
        config.plugin('copy').tap(args => {
            args[0][0].ignore = ['.DS_Store']
            return args
        })
    },
    productionSourceMap: false,
    lintOnSave: false
}
