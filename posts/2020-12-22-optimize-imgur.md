---
title: 'imgur画像の最適化'
date: '2020-12-22'
---

ブログの画像は imgur を使うことにしたが、そのためにいくつか工夫をした。

## 簡易記法

[前回](/posts/2020-12-21-blog-building) も書いたように標準の markdown では `![caption](url)` という記法が面倒なため、[remark-images](https://github.com/remarkjs/remark-images) などを参考にして plugin を作った。

url のみを書いた行があれば自動的に画像として表示を行い、さらに続けて次行にテキストが書かれていた場合は caption を表示するようにしている。

## imgur のサムネイル

https://api.imgur.com/models/image

imgur は画像 id の後に m などを付けるとサイズ別のサムネイル画像が得られる。上記 plugin の中で画像 url が imgur のものに対しては自動で画像パスを変更し、サムネイルを表示するようにした。

## webp 化

imgur は webp 画像も生成している。拡張子を webp にするだけで良い。なので元の 画像 url は img タグとして出力し、srcset として 拡張子を webp に変えたパスも出力して picture タグで囲うようにした。

## native lazyload

今どきのブラウザなら loading="lazy"と書くだけで lazyload してくれる。しかし画像の高さが指定されていないとそもそも動作しないようなので、初期スタイルとして min-height で高さを指定し、画像の onload のタイミングで auto にして解除するようにしてみた。

## つまり…？

https://i.imgur.com/BfDUIDb.png
こんな感じの記法でここまで生成する

## パフォーマンス測定

下記のページを計測（画像 7 枚）

https://miyaoka.dev/posts/2020-12-19-okutama-cycling

https://i.imgur.com/zili4Kr.png
mobile での before/after

https://i.imgur.com/uMW8N5J.png
pc での before/after

ロードする画像の容量が大幅に削減され、初期表示を改善できた。
