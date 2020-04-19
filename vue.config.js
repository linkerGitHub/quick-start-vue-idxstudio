module.exports = {
  configureWebpack: {
    externals: {
      'ClassicEditor': 'window.ClassicEditor',
      idxConfig: 'idxConfig'
    }
  },
  publicPath: '',
  outputDir: 'dist',
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}
