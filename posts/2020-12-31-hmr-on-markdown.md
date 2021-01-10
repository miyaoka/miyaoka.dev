---
title: Next.jsブログのmarkdown編集時に表示更新する
date: '2020-12-31'
---

https://i.imgur.com/RSiYuJB.png

[以前](/posts/2020-12-21-blog-building)書いたように Next.js の blog で markdown ファイルを更新しても自動で表示が更新されない問題があったが、無理やり解決する方法を実装できた。

https://github.com/vercel/next.js/issues/2311#issuecomment-309463540

ここの Issue のコメントを見ると「content を監視して変更時に js ファイルの末尾にスペースを追加することで更新を発生させる」という手法があるようだった。ただのスペースだからコミット時には prettier で削除される。

しかし、これをやってみたが現在の Next.js では変更監視が厳密になっており、コードに影響を及ぼさないスペースは変更と見なされないようだった。

なのでスペースではなく変更を発生させうるコード（ここでは console.log）を書き込んで、1 秒後に元に戻すようにしてみた。

```next.config.js
const fs = require('fs')

let isUpdating = false
const postLib = `${__dirname}/lib/posts.ts`

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
```

さすがに無理やり感が否めないが、[ちゃんとやろうとすると](https://github.com/vercel/next.js/discussions/11419#discussioncomment-187176) めんどくさそうなのでとりあえずこれで良しとしたい。

いやそもそもこんなことしなくてもできるよという有益情報をお持ちの方は教えていただけると嬉しい。

ちなみにこの config は何も export してないので `warn - Detected next.config.js, no exported configuration found` と警告が出てしまう。まあ warn なのでスルーしている。
