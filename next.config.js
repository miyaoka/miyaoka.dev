const fs = require('fs')

let isUpdating = false
const postLib = `${__dirname}/pages/posts/[id].tsx`

const onChangePost = () => {
  if (isUpdating) return
  isUpdating = true
  const content = fs.readFileSync(postLib, 'utf-8')

  // libファイルにコードを書き加えて強制的にHMRを起こす
  fs.writeFileSync(
    postLib,
    `${content}\nconsole.log('updatedAt: ${new Date().toISOString()}')`
  )
  // 1秒後に元に戻す
  setTimeout(() => {
    fs.writeFileSync(postLib, content)
    isUpdating = false
  }, 1000)
}
require('chokidar')
  .watch('./posts', { ignoreInitial: true })
  .on('add', onChangePost)
  .on('change', onChangePost)

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})
