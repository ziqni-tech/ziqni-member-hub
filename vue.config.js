const fs = require('fs')

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,

  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false,
      fallback: { "querystring": require.resolve("querystring-es3") }
    }
  },

  transpileDependencies: [
    // '@coreui/utils'
  ],

  // devServer: {
    // proxy: 'https://api.ziqni.com/',
    // host: 'first-space.local-unsafe.ziqni.app',
    // port: 8085, // CHANGE YOUR PORT HERE!
    // https: {
    //       key: fs.readFileSync('./dev/certs/wildcard-local-unsafe-ziqni-app.key'),
    //       cert: fs.readFileSync('./dev/certs/star_local-unsafe_ziqni_app.crt'),
    // },
    // hotOnly: false,
  // },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
