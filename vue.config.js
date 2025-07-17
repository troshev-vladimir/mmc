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
  filenameHashing: true,
  devServer: {
    https: true,
    host: 'localhost',
  },

  chainWebpack: (config) => {
    config.asyncChunks = true
    config.devtool(process.env.NODE_ENV === 'production' ? false : 'source-map')
    config.plugin('html').tap((args) => {
      args[0].template = path.join(__dirname, 'public', 'index.html')
      // args[0].filename = 'app.html'
      return args
    })

    config.output.filename(`js/[name]--[contenthash].js`)
    config.output.chunkFilename(`js/[name]--[contenthash].js`)

  },
  transpileDependencies: ['vuetify'],
}
