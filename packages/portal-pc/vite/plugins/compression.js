import compression from 'vite-plugin-compression'

export default function createCompression (env) {
  const { VITE_BUILD_COMPRESS } = env
  const plugin = []
  if (VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    if (compressList.includes('gzip')) {
      // 使用gzip解压缩静态文件
      plugin.push(
        compression({
          verbose: false, // Whether to output the compressed result in the console
          ext: '.gz',
          deleteOriginFile: false
        })
      )
    }
  }
  return plugin
}
