---
title: Next.jsブログのmarkdown編集時にHMRする(2)
date: 2021-01-09 22:00
---

Next.js ブログの記事編集時に自動表示更新機能を[以前実装した](/posts/2020-12-31-hmr-on-markdown)が、スクロール位置が失われる問題が出てきたので実装方法を変更した。

https://i.imgur.com/RSiYuJB.png

なぜスクロール位置が失われるかというと、`getStaticProps` を再実行させてしまっているところに問題がある。これは SSR を引き起こすので新しいページとして更新されてしまい、そのためページトップに戻ってしまうということが分かった。

なので、ページはそのままにして内部のレンダリングのみ更新させたい。つまりページコンポーネントを更新すればそこだけ再レンダリングが行われる。ただし `getStaticProps` はまさに static であるため新しいコンテンツ内容は入ってこない。

そこで props をいったん state に入れて ページ内容を state から描画するようにし、再レンダリング時は useEffect で最新内容のコンテンツを state にセットし直して表示するようにした。コンテンツはファイルシステム内にありクライアントからはアクセスできないので、取得用に API を作りそこから fetch させる。

https://github.com/miyaoka/miyaoka.dev/pull/14

```tsx
const [post, setPost] = useState(postData)

// dev時ならmount時に記事内容の再取得を行う
if (process.env.NODE_ENV !== 'production') {
  useEffect(() => {
    const fn = async () => {
      const res = await fetch(`/api/posts/${post.id}`).then((res) => res.json())
      setPost(res.postData)
    }
    fn()
  }, [])
}
```
