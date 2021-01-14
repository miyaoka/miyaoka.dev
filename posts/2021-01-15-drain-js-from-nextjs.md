---
title: NextのJSぜんぶ抜く
date: 2021-01-15
---

サイトパフォーマンスを最適化するため、export 時に Next.js のランタイムを全部抜いた。

https://i.imgur.com/eECrgcf.png

## どういうことか？

このブログは静的書き出しをしているので、ただの静的なドキュメントといえる。だが Next にしろ Nuxt にしろ、書き出したページをブラウザで読み込むと JS アプリケーションとして振る舞うために Hydration 処理が行われる。これにより JS モジュールの読み込みや Scripting 処理の負荷が発生する。

https://i.imgur.com/OLCCKb6.png
書き出された HTML には Hydration 処理用に JS モジュールやシリアライズされた state が挿入されている

## ピュア HTML を目指して

しかしこのブログはドキュメントでありアプリケーションではないので、ほぼ JS を動かす必要はない。state は不要だし、client-side routing も要らない（先読みに必要かもだが）。なのでピュアに HTML として書き出したい。

Next.js の場合、body の下に `<NextScript />` という要素があり、これを消せばまるっと JS が消えるようだ。なので env が production のときだけ消せばいいかと思ったが、調べてみるとちゃんとフル静的化するオプションが experimental で存在するようだ。

https://github.com/vercel/next.js/pull/11949
Allow disabling runtime JS in production for certain pages (experimental)

```js
export const config = {
  unstable_runtimeJS: false,
}
```

このコードを JS 抜きたいページ毎に設定するとフルに静的化される。

https://i.imgur.com/Im7CLfP.png
生成したページ。完全にただの HTML になった

## 動的なパーツは Web Component 化

とはいえ全く script を使わないただの HTML だと困るところも少しある。

以前作った [埋め込みツイートの読み込み部分](/posts/2021-01-07-tweet-component) は自身の状態に応じてレンダリングを変えたり IntersectionObserver による lazyLoad 処理をしたりと、next のレンダリングとは別の機能を持った要素だ。なので Web Component として独立させた。

あとトップページの記事サムネイルも、画像 onload のタイミングで transition させる制御を入れているので、これも Web Component 化を行った。

Web Component はバニラで書いたり、[LitElement](https://lit-element.polymer-project.org/)、[Stencil.js](https://stenciljs.com/) などのライブラリを用いるやり方などがあるので、それぞれでの作り方を試してみた。

JSX で書けたり Prop の定義が楽だったりレガシーブラウザ対応がしやすそうという点で最終的には Stencil を使うことにした。

作ったコンポーネントは別レポジトリで管理し、npm に publish して読み込めるようにした。next に依存させないよう、プロジェクトに import するのではなく script タグから読み込むようにしている。

https://i.imgur.com/CJsPtar.png
script タグから読み込み。モダンとレガシー向けの 2 種類

## type="module"と nomodule でレガシーとの住み分け

<iframe width="560" height="315" src="https://www.youtube.com/embed/cLxNdLK--yI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

script 読み込みについてはこの動画で詳しく解説されているが、今どきのブラウザはモダンな JS を解釈できるためわざわざ es5 など古いコードにトランスパイルする必要が無い。

https://i.imgur.com/eWtmzuK.png
レガシー向けにトランスパイルされた無駄なコードはもはや環境問題

https://i.imgur.com/YsJDXNG.png
95%のブラウザは軽量なコードで済む

なのでレガシー対応するためにはモダン用とレガシー用それぞれにビルドし、ブラウザに応じて必要なほうだけ読み込ませるといい感じになる。script type="module"はモダン向けで、nomodule はレガシー向けになる。

## そもそも JS ぜんぶ抜くのなら、最初から非 Node 系静的サイトジェネレータで良かったのでは？

そういう話もある。フロントエンド不要論だ。

https://jamstack.org/generators/
Static Site Generators - Top Open Source SSGs | Jamstack

非 Node だと Hugo とか Jekyll とかあるのだが、単にテンプレートだけでも JSX じゃないとつらいなと感じる。
