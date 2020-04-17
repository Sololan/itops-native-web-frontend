const GenerateAssetPlugin = require('generate-asset-webpack-plugin')
const defaultGateWay = {bs: 'web-native', uc: 'uc', adapter: 'monitor-adapter'}
const createConfig = function (compilation) {
  const env = process.env.VUE_APP_ENV
  const cfgJson = env === 'release' ? {
    /* release default config */
    gateWay: defaultGateWay,
    url: 'http://192.170.1.206:8090'
  } : env === 'preview' ? {
    /* preview default config */
    gateWay: defaultGateWay,
    url: 'http://192.170.1.208:8090'
  } : env === 'production' ? {
    /* production default config */
    gateWay: defaultGateWay,
    url: 'http://192.170.1.204:8090'
  } : {
    /* development default config */
    gateWay: defaultGateWay,
    url: 'http://localhost:8080/site'
  }
  return JSON.stringify(cfgJson)
}

// vue.config.js
module.exports = {
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'assets',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    open: true,
    // port: 8080,
    proxy: {
      '/site': {
        target: 'http://192.170.1.35:8090/',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/site': '/'
        }
      }
    }
  },
  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
  configureWebpack: {
    // 关闭性能提示
    performance: false,
    plugins: [
      new GenerateAssetPlugin({
        filename: 'dynamicConfig.json',
        fn: function (compilation, cb) {
          cb(null, createConfig(compilation))
        }
      })
    ]
  }
}
