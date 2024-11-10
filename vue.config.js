// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },

  devServer: {
    https: true,
    host: 'localhost',
  },

  configureWebpack: (config) => {
    return {
      devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
      // plugins: [
        // new BundleAnalyzerPlugin(),
      // ]
    }
  },

  chainWebpack: (config) => {
    config.output.filename(`js/[name]-[hash].boundle.js`)
    config.output.chunkFilename(`js/[name]-[hash].js`)
    config.asyncChunks = true
    config.plugin('html').tap((args) => {
      args[0].template = path.join(__dirname, 'public', 'index.html')
      // args[0].filename = 'app.html'
      return args
    })
    
  },
  transpileDependencies: ['vuetify'],
}
