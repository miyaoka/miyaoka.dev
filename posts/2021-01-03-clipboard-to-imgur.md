---
title: VSCode拡張でクリップボード画像をImgurにアップロードする
date: '2021-01-03'
---

GitHub の編集欄みたいに、markdown エディタに画像を貼り付けたらストレージにアップロードして、その URL を挿入するようにした。

VSCode 拡張を作ったこと無かったので一から作ってみようと思ったが、検索したら既にそれっぽいのがあった。

https://marketplace.visualstudio.com/items?itemName=MaxfieldWalker.vscode-imgur
vscode-imgur

ほぼほぼこれで良かったのだが、最終的な出力が `![Image](https://i.imgur.com/****.png)` という markdown 記法になっており、自分のブログでは URL のみの記法が望ましいのでちょっといじることにした。

## onPaste は無い

貼り付けということで、単純にペースト時のイベントから内容を取得できるのかと思っていたらそう簡単ではなかった。

先ほどのソースを調べたら `cmd+alt+v` をショートカットに登録し、そこからアクションを起こすようになっている（なので普通のペーストのときには発動しない）。

他の似たような拡張も調べてみたがみんな同じ形式だった。おそらくはみんな 4 年前に作られた [Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image) という拡張を元にして作っているっぽい。

## WSL 環境でうまくいかない

ペースト時にクリップボードから画像を取得するのだが、これが [Windows, Mac, Linux 用にそれぞれ script 処理](https://github.com/mushanshitiancai/vscode-paste-image/tree/fb795320aedea24a03e5c7d43d1059e4080277b3/res) があった。

問題なのは WSL 環境で、Linux の xclip を使うのだが WSL だとそこがうまくいかない。これは分かる人がいたら教えてほしい。

## Imgur API

### App 登録

imgur にアップロードするには ClientId と ClientSecret が必要なのだが、そのためにまず Application を登録する必要がある。

https://apidocs.imgur.com/#intro

これを説明の通りやっていったのだが、[Register an Application](https://api.imgur.com/oauth2/addclient) するところで callback URL を指定するとリダイレクト先の画面が壊れててうまくいかなかった。

https://stackoverflow.com/questions/57550259/google-oauth-seems-broken-for-imgur-api

https://i.imgur.com/Ied42En.png

結局ここでは without a callback URL のほうを選んだらうまくいった。

### accessToken 取得

https://imgur.com/account/settings/apps

App を登録すると clientId と clientSecret が取得できる。これを VSCode 拡張の config に設定し、初回は認証 URL を叩いてブラウザで PIN を表示させ、それを ユーザーに VSCode の InputBox に入力してもらい、そこから accessToken を取得するという手順が必要になることを元のソースを読んで学んだ。

### upload 処理

![loading](https://i.imgur.com/LEOtF90.gif)

アップロード中は `![loading...](https://i.imgur.com/***)` というテキストを挿入してアップロード後にそこを置き換えることになるが、せっかくなのでここでローディングの gif を表示するようにした。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">クリップボード画像貼り付け→imgurアップロード→webp化 <a href="https://t.co/8hUQ4ynTAa">pic.twitter.com/8hUQ4ynTAa</a></p>&mdash; miyaoka / STUDIO (@miyaoka) <a href="https://twitter.com/miyaoka/status/1345691502769389568?ref_src=twsrc%5Etfw">January 3, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

まとめると、こんな感じの運用になってる。

https://github.com/miyaoka/vsc-clipboard-to-imgur