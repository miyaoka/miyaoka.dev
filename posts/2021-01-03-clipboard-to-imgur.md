---
title: VSCode拡張でクリップボード画像をImgurにアップロードする
date: '2021-01-03'
tags: [tech, vscode]
---

https://i.imgur.com/iAYpkt3.png

GitHub の編集欄みたいに、markdown エディタに画像を貼り付けたらストレージにアップロードして、その URL を挿入するようにした。

VSCode 拡張を作ったこと無かったので一から作ってみようと思ったが、検索したら既にそれっぽいのがあった。

https://marketplace.visualstudio.com/items?itemName=MaxfieldWalker.vscode-imgur
vscode-imgur

ほぼほぼこれで良かったのだが、最終的な出力が `![Image](https://i.imgur.com/****.png)` という markdown 記法になっており、自分のブログでは URL のみの記法が望ましいのでちょっと構造を調べていじることにした。

## どうやっているのか？

[VSCode 拡張の開発ドキュメント](https://code.visualstudio.com/api/get-started/your-first-extension) を手順通りやってみて、既存の拡張機能のコードを読んでみた。単純にペースト時のイベントから内容を取得できるのかと思っていたが案外そう簡単ではなかった。

そもそもペーストを検知するイベントが無く、また `vscode.env.clipboard` で clipboard にアクセスはできるのだがテキストの読み書きメソッドしかないので画像は取得できない。

先ほどのソースを調べたら `cmd+alt+v` をショートカットに登録し、そこからアクションを起こすようになっていることが分かった（なので普通のペーストのときには発動しない）。

他の似たような拡張も調べてみたがみんな同じ形式だった。おそらくはみんな 4 年前に作られた [Paste Image](https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image) という拡張を元にして作っているっぽい。

[Issue](https://github.com/microsoft/vscode/issues/30066) を見ても Open 状態なのでまだ paste イベントは無いようだ（ちゃんと読んでない）。

また、コード的には [Paste Image from local pc](https://marketplace.visualstudio.com/items?itemName=sakamoto66.vscode-paste-image) というものが 4 ヶ月前で新しく、元コードのでかいコールバック部分を Promise に書き換えていたり、AppleScript の代わりに pngpaste を使うようにしていたので参考にさせてもらった。

## WSL 環境でうまくいかない

ペースト時にクリップボードから画像を取得する部分については、 [Windows, Mac, Linux 用にそれぞれ script 処理](https://github.com/mushanshitiancai/vscode-paste-image/tree/fb795320aedea24a03e5c7d43d1059e4080277b3/res) があった。

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

### 表示最適化

あとは[以前書いたように](/posts/2020-12-22-optimize-imgur) imgur は各種サムネイルと webp 画像を生成してくれるので、markdown のパースをするところで最適化した画像を srcset に設定している。

https://twitter.com/miyaoka/status/1345691502769389568

まとめると、こんな感じの運用になってる。

## リポジトリ

https://github.com/miyaoka/vsc-clipboard-to-imgur
