---
title: Next.jsブログのmarkdown編集時に表示更新する(3) 〜最終版〜
date: 2021-01-10
---

記事編集時に自動表示更新する機能の実装について、新たに別解が出てきたので書いておく。

https://i.imgur.com/RSiYuJB.png

https://github.com/vercel/next.js/discussions/11419#discussioncomment-271644

ここのコメントによると [next-remote-watch](https://github.com/hashicorp/next-remote-watch) を使うという手があるとのこと。これが何をやっているかと言うと next の dev サーバーに機能を加えたものになっていて、指定した path のファイル変更があるとページのリロードを行ってくれる。

実際試してみたら確かに表示更新できた。ただ挙動はこれまでとちょっと異なる。

これまでの手法を比較して以下にまとめる。

## getStaticProps を再実行させる

[最初にやってみた手法](/posts/2020-12-31-hmr-on-markdown)

→ ページを再生成させる

- next.conf から無理やり getStaticProps が読んでいる関数ファイルに変更を発生させる
- ブラウザのスクロール位置などの情報は失われる

## ページコンポーネントを HMR させ、mount のタイミングでコンテンツを再取得する

[前回やってみた手法](/posts/2021-01-09-hmr-on-markdown-2)

→ コンポーネントのみ再読み込みさせる

- next.conf から無理やりページコンポーネントに変更を発生させる
- クライアントからコンテンツ取得するための API を追加し、ページコンポーネント内に再取得用のコードを書き加える
- 読み直しはこれが最速

## next-remote-watch でリロードを発生させる

今回の手法。

→ ページを読み込み直す

- dev サーバーと route を拡張して、ファイル変更を検知したらリロードさせる
- `next dev` コマンドを `next-remote-watch [target]` に書き換えるだけ
- ページを再読み込みするので一旦真っ白になる
- next のドキュメント化されていない API を使っているのでその点は保証が無いとのこと

## まとめ

- 簡単にやるなら next-remote-watch
- 記事編集時の体験性重視なら 2 番めのやつ
- 続きがあったらタイトルは 最終版 変更 決定版とかになる
