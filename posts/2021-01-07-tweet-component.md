---
title: 埋め込みTweetをWeb Componentsで描画するようにした
date: '2021-01-07'
---

[Zenn](https://zenn.dev/) が Web Components を使って tweet を表示するようにしていたので、見習ってこのサイトにも取り入れてみた。

https://i.imgur.com/QMHKw1q.png

https://zenn.dev/steelydylan/articles/zenn-web-components
Web Components を利用した Zenn マークダウン部分の改善について

https://github.com/zenn-dev/zenn-editor/tree/10fef04c83fb238b8fcdf7260acc8725666bf258/packages/zenn-embed-elements
ZennEditor 内のコード

## 比較

https://twitter.com/miyaoka/status/1346853138259611648?s=20

## 何が良いのか？

### 埋め込みコードの良くないところ

```
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ほぼだいたい完全に理解した</p>&mdash; miyaoka / STUDIO (@miyaoka) <a href="https://twitter.com/miyaoka/status/1346720500387438593?ref_src=twsrc%5Etfw">January 6, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```

- SPA サイトではページ遷移などで再レンダリングされると 埋め込みコードの script タグが実行されないので アプリ側で `twttr.widgets.load()` を叩く必要がある。
- Zenn の記事にあるように `twttr.widget.load()` を走らせるのはページ内の全要素が対象になるためパフォーマンスの問題が少しある。
- この間対応した [markdown 編集時の自動再読み込み](/posts/2020-12-31-hmr-on-markdown) を行うとロードされないのが気になっていた
- 埋め込みコードを取得するのがだるい。（ツイートの右メニューから `Embed Tweet` を選んで別ページに遷移し、アニメーションが入ったあとでやっとコピーできる）

### Web Components 化して良くなったところ

```
https://twitter.com/miyaoka/status/1346720500387438593?s=20
```

↓ markdown を HTML にするところで tweet の URL にマッチすれば Custom Element として出力

```
<embed-tweet src="https://twitter.com/miyaoka/status/1346720500387438593" />
```

→ Custom Element の`connectedCallback` イベントで最初は URL だけ表示し、twitter widget を load し終わったら URL は消す

- Tweet の URL だけ貼れば表示できる
- 各コンポーネントが自身の要素だけ load 実行する
- 再レンダリングされても各コンポーネントのマウント時に load が行われるので、アプリ側で気にしなくていい

### だめになったところ 🤮

- 埋め込みコードは blockquote でテキスト内容が入っているのでロードされなくても情報があるが、URL だけだと情報が皆無
- ツイ消しされるとなんのツイートだったか分からなくなって困ってしまう（VSCode 拡張作って URL 貼付け時に内容取得しに行くべきか？）
- 埋め込みコードのオプションで `Hide Conversation` などが指定できない

## Custom Elements ⊂ Web Components

Web Components って書いてたけど、Custom Elements って言ったほうが正しいかもしれない。昨日初めて触ったからまだ良くわかってない。

https://twitter.com/miyaoka/status/1346663025621680128?s=20

https://twitter.com/yamanoku/status/1346663437389103105?s=20

https://twitter.com/miyaoka/status/1346664808402206721?s=20

https://www.webcomponents.org/introduction
Introduction - webcomponents.org
