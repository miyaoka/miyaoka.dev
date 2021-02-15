---
title: Vueコンポーネントをcomposition APIに書き換えるやつを作っている
date: 2021-02-15
---

Vue2 の Options API で書かれたコンポーネントを、composition API を使った書き方に自動変換したくてツールを作った。

https://i.imgur.com/xjEAswh.png
左：Options API / 右：Composition API

## リポジトリ

https://github.com/miyaoka/vue-composition-converter

## デモ

https://vue-composition-converter.vercel.app/

## なにがしたいのか

[VueUse](https://vueuse.js.org/) のような composition 用の便利なライブラリを使いたいし、とりあえずコンポーネントからロジックを分離したいというモチベーションがあったため、いくつか既存コンポーネントを人力で書き換えてみるのを試してみた。

しかし手作業でやってみると作業量が多く、これは自動化しないときついと思ったのでツール化することにした。

デモを見ると分かるが、Vue2 から Vue3 への移行ツールではなくて、Vue2 のまま [Composition API プラグイン](https://github.com/vuejs/composition-api)を用いた記法に書き換えるものになっている。

これは現状の自分のプロジェクトを完全に Vue3 移行させるのが難しかったため、暫定のブリッジ対応という位置づけになっている（別途変換オプションを加えれば Vue3 用もできそう）。

## 公式に無いのか？

自分で作る以前に公式にコンバーターあるんじゃないかと思ったものの、どうもありそうな雰囲気が無かった。

https://twitter.com/kazu_pon/status/1359312813999620098?s=20

あとで kazupon さんに教えてもらったが、2 年前くらいに作りかけのやつがあったようだ。

Vue は記法がいろいろあるので、Class Component 対応とかも考えるとわりと公式に用意するのも大変かもという気はした。

## どういう変換をしているのか？

- 入力値として Vue の SFC コンポーネントの文字列を受け取り、
- [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler) で SFC から script 部分を抽出し、
- それを [TypeScript の compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) で AST にし、
- export default しているところの 各 options の値を読み取り、
- 新しい export に変換して出力している

### export default を defineComponent 化

`export default Vue.extend({})` と `export default {}` のパターンがあるが、どちらも `export default defineComponent({})` に書き換えている。

### setup 関数の追加

composition なので `setup` 関数を追加する。

引数に`props`と`context`を取るが、context は Vue3 と Vue2+plugin では少し異なる。

### data, computed, watch, methods, lifecycle -> setup

data ~ lifecycle の option は削除して、setup 内に以下のように定義する。

- data -> ref
- computed -> computed （vuex の mapState, mapGetters も含む）
- watch -> watch
- methods -> function （vuex の mapActions も含む）
- lifecycle -> new lifecycle hook
  - beforeCreate, created -> 即時関数
- data, computed, methods で宣言した変数を setup 末尾で return する

### props -> setup

props はそのままだが、setup 内で使えるように setup 第 1 引数の `props` を `toRefs` で各 prop にスプレッド展開する。

スプレッドせずに `props.prop` としたほうが良い気はするが、既存の this のどこで prop が使われているのか判別しづらいのでこうしている。

また、props が無いコンポーネントの場合は、setup 関数の第 1 引数が未使用になるので、`_props` にしている。

### this の変換

compisition API の setup オプションの中では `this` を使わないようになるので変換していく。

- `this.$xxx` -> `ctx.root.$xxx` （ctx は setup の第 2 引数。ctx.root は this 相当だが Vue3 では使えない）
- `this.xxx`
  - xxx が ref, computed なら -> `xxx.value`
  - それ以外 -> `xxx`

（このへんはきちんと node を辿らずに、雑にブロック全体を文字列として正規表現で置換しているだけなので、文字列中に this.xxx が定義されていると余計に変換してしまう（が、そういうケースはあまり無いだろうという判断））

### import の設定

- 以上の変換処理で使用された依存モジュールを import に宣言する
- `defineComponent`, `toRefs`, `ref`, `computed`, `watch`, `各種 lifecycle hook` を使われているものだけ import

## まとめ

- 変換用の CLI として作ろうとしていたが、結局ブラウザで入出力の確認画面があったほうが分かりやすいのでつけてる
  - lib 部分だけコンパイルすれば CLI として使えそう
  - test 書くべきだが事前に入力パターンが想定しきれず、確認画面で動的に見たほうが検証しやすい感じだったので test 書いてない
- メタプロ初めてなので AST の変換の仕方とかこれでいいのかよく分かってない
  - setup に変換するためにまるっとソースを作り直しているので、元ソースのコメントは全部飛ぶ（どうすれば…）
