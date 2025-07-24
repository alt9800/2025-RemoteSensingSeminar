---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第五回 2025/07/25"

paginate: true

style: |
    section.title {
        justify-content: center;
        text-align: left;
    }
    .round-icon {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 400px;
      height: 400px;
      border-radius: 20%;
      object-fit: cover;
      z-index: 10;
    }
    .tiny-text {
    font-size: 0.6em;  /* 通常の60%サイズ */
    }
    img {
      max-width: 100%;
      height: auto;
      image-rendering: -webkit-optimize-contrast;
    }



---
# 衛星データ解析技術研究会<br>技術セミナー（応用編）
## Webアプリケーションの開発技術の習得

第五回 2025/07/25

担当講師 : 田中聡至

---

お知らせ 1
Slackのリンク
https://join.slack.com/t/2025-qzu7873/shared_invite/zt-39hkj0z6q-8vt0qOy7h1zJ7Ug9mwM~7A

なんらかの原因で、Slackに入れなくなった方はこちらから
8/15にリンクが消失します。
(講義後はSlackのお部屋はアーカイブせずに消えるまで残す予定です。シンプルなテキストとしてバックアップはとります。)


---

お知らせ 2
https://alt9800.github.io/2025-RemoteSensingSeminar/
講義資料はスライド (pdf)だと、コードのコピペがしにくかったので、
講義資料のコードブロックが利用しやすいようにhtmlでも提供するようにしました。



---

前回のあらすじ

### ゆるいMVC
Model: データベース処理（ただしroutes内に混在しており、単一責任原則は満たさない）
View: 静的HTML + JSON API
Controller: routes以下

(そもそもExpress.js自体がroutes以下にControllerとModel両方の役割を持つ構成になる)

---

```
src/
└── routes/
    ├── auth.js       # 認証コントローラー
    ├── users.js      # ユーザーコントローラー
    └── posts.js      # 投稿コントローラー
```



---

RESTfulとはなにか？



---


シングルページアプリケーションについて

ルーティング(APIエンドポイント)のパターンが変わる

---






ホワイトリストとブラックリスト


---
API設計


TLSについて



---


今週の実験

GPS / GNSS ログデータを表示しよう




---

OpenStreetMap自体をうまく使う

---


強くMVCに乗っ取ることよりも、どこにどの役割があるのかを意識する方が大切

---


次回に向けてのワーク


実際にデプロイするアプリケーションを作ろう！！


予告をしておくと、Docker形式だと

---

[AppRun β版 | さくらのクラウド マニュアル](https://manual.sakura.ad.jp/cloud/manual-sakura-apprun.html)

[コンテナレジストリ | さくらのクラウド マニュアル](https://manual.sakura.ad.jp/cloud/appliance/container-registry/index.html)


---

コンテナ作成の手順(さくらのAppRun編)

1. さくらインターネットのアカウントを作成
2. ダッシュボードよりさくらのAppRunに移動する (ホーム > [AppRun](https://secure.sakura.ad.jp/apprun/applications) )
3. 「さくらのクラウド」ページ(ホームより一段下ったページ)のグローバル > コンテナレジストリ でコンテナイメージを登録
4. AppRun側からコンテナレジストリに登録したイメージを選択して、起動するコンテナの設定を行う


---


(クラウドの利用歴の質問を行う)

AWS / Google Cloud / Azure

サーバレスとはなにか説明できるか

コンピュートエンジン / VPSを適切に利用できるか

環境構築をIaCで行えるか



---

サンプルのサーバをつけておきます。


---

プロトタイピングについて


tldraw.io


figma
canva