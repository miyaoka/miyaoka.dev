---
title: 'imgur画像の最適化'
date: '2020-12-22'
---

ブログの画像は imgur を使うことにしたが、そのためにいくつか工夫をした。

## 簡易記法

標準の markdown では `![caption](url)` と書かないといけないが、[remark-images](https://github.com/remarkjs/remark-images) などを参考にして url を書くだけで画像拡張子だったら画像として表示するような plugin を作った。さらに次行にテキストが書かれていた場合は caption として表示するようにしている。

## imgur のサムネイル

https://api.imgur.com/models/image

imgur は画像 id の後に m などを付けるとサイズ別のサムネイル画像が得られる。上記 plugin の中で画像 url が imgur のものであったら、自動的にサムネイルを表示するようにした。

## webp 化

imgur は webp 画像も生成している。拡張子を webp にするだけで良い。
なので元の 画像 url は img タグとして出力し、srcset として 拡張子を webp に変えたパスも出力して picture タグで囲うようにした。

## native lazyload

今どきのブラウザなら loading="lazy"と書くだけで lazyload してくれる。しかし画像の高さが指定されていないとそもそも動作しないようなので、初期スタイルとして min-height で高さを指定し、画像の onload のタイミングで auto にして解除するようにしてみた。

## 結果

https://i.imgur.com/zili4Kr.png
mobile での before/after

https://i.imgur.com/uMW8N5J.png
pc での before/after

ロードする画像の容量が大幅に削減され、初期表示を改善できた。
