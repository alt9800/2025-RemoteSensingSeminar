---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第六回 2025/08/01"

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

第六回 2025/08/01

担当講師 : 田中聡至

---

## アジェンダ


### デプロイ編
### ジオな体験を記録に残そう！(実践編&前回からの課題)
→先に少しだけアイディアワークショップをやります。

---


今回使うのは

## AppRun β (さくらインターネット) : コンテナ環境
## Xserver VPS : ベアメタル環境


(ハンズオンとしては講師に追従することを必要としませんが、もし、一緒の速度でやりたい場合はそれぞれのアカウントをご用意ください。)
(電話番号とクレジットカードの番号が必要となります。)


---

# アプリケーションのデプロイ

---

## どこで動かすか

## どうやって動かすか

## 何を動かすか

---

## どうやって動かすか / 何を動かすか

* 静的サイトホスティング
* 抽象化インフラ(動的サイトホスティング ... とは言わないかも)
* サーバレス運用
* VPS運用
* コンテナレジストリ


---

# 色々な場所でシステムを動かそう！

---

## Linux環境下で動かす

Linux環境下にNode.jsなどが動く環境を用意して動かします。


---

## そもそもLinux慣れてない方向けのアイディア

* Cloud Shell ([Google Cloud](https://cloud.google.com/shell/docs/using-cloud-shell?hl=ja)、[さくらインターネット](https://www.sakura.ad.jp/services/cloudshell/))を試す

* Dockerを利用して、Linuxに直接構築する

VagrantやVMwareを入れる

---

### ☝️一口メモ : Dockerを利用して、コンテナ内のLinuxにログインできます。  
`docker run -it --rm -v $(pwd):/app expresson` のような形でコンテナに入れます。(sshで接続します)

`docker run` コマンドにはさまざまなサブコマンドが用意されていて、ログイン時の設定や利用したい環境変数、ユーザ設定などを記載することもできる他、これらをDockerfile内に記載することも可能です。

---

別タブでコンソールを開いて、

```bash
# コンテナから外部へファイルをコピー
docker cp container_name:/path/to/file /host/destination
```

とすると、起動中のコンテナに対して状態をセーブすることができます。

本番環境: Docker Volume
開発環境: バインドマウント(**/mnt**)
一時的な保存: コピー(`docker cp`)コマンド

と覚えておくと便利です。(もとからコンテナとホストマシン(Win|Mac)で共有するフォルダを指定しておくことをお勧めします。)

---

## AWSで動かす

EC2 は基本的にVPSのように使うことができます。
sshとして接続する際はAWSサービスの外側に対して接続可能なIPアドレスがListenしている必要がありますが、ガイドラインを見る限り現在でもそんなに接続に手間はないようです(.pemファイルを渡すだけ。)

(講師としてはちゃんとRoute53などを用意した方がいいのかと思っていましたがそこまで仰々しいパスを用意しなくても良い様子)

[SSH クライアントを使用して Linux インスタンスに接続する - Amazon Elastic Compute Cloud](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html)


---

ちなみにWindowsマシンをAWSで動かして、リモートデスクトップを用いて、GUIで接続する方法もあります。

[RDP を使用した Windows インスタンスへの接続 - Amazon Elastic Compute Cloud](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/connecting_to_windows_instance.html)

同様の方針で、LinuxもGUIで接続したい場合は、ソフトウェアとしてGUIを導入することができます(**仮想デスクトップ**というワードで検索すると良いです。**Lubuntu**などが軽くておすすめ。VNCで接続する方法もあります。)

---

☝️ 日本語環境だと多くの場合、Virtualを「仮想の」と訳すことが多いですが、原義としては「実質的な」という意味で捉えた方が良いです。
そもそもGUI自体もプログラム(プラグイン)であるので、仮想デスクトップという単語自体に問題があるかもしれません。

---

### 最小構成

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Route 53  │─────│  EC2インスタンス  │─────│  EBS Volume  │
│    (DNS)    │     │  - Node.js      │     │  - SQLite    │
└─────────────┘     │  - Express.js   │     │  - Uploads   │
                    │  - PM2          │     └──────────────┘
                    └─────────────────┘

```


---

[AWS Elastic Beanstalk](https://aws.amazon.com/jp/elasticbeanstalk/)を使うのが今風だそうです。

レンタルサーバのサーバーサイドを含めた版。
root権限がなく、限定的な動作ができるサーバーと捉えてください。

Heroku、Fly.io、Render、Railwayなど独立したPaaSが存在します。

---

Elastic Beanstalkを中心に考えるならこんな感じ？

```

┌────────────┐     ┌──────────────────┐     ┌────────────┐
│ CloudFront │─────│ Elastic Beanstalk│─────│    RDS     │
│   (CDN)    │     │  - Node.js       │     │ (PostgreSQL)│
└────────────┘     │  - Auto Scaling  │     └────────────┘
                   │  - Load Balancer │            │
                   └──────────────────┘            ▼
                            │                  ┌────────┐
                            └─────────────────>│   S3   │
                                               │(Images)│
                                               └────────┘
                                              
```

---

## 〇aaSとは?

*Platform as a Service* をはじめとするエンタープライズのサービス群を指します。

* Infrastructure as a Service
* Platform as a Service
* Backend as a Service

などなど
正確な切り分けは難しいですが、サーバーを置くためのサービスと考えると良いでしょう。
モバイルのバックエンドに特化して、`MBaaS`を謳うサービスもあります。



---

## エッジで(サーバレスとして)動かす

サーバレスアーキテクチャとは?
→特定の機能のみを実行する組み合わせで構成されるアプリケーション
(〇〇Function のような名前のサービスであることが多いです。)


---

### 著名クラウドサービスの区分け

||VPS|非rootサーバー|サーバレス|
|---|---|---|---|
|Amazon Web Services|EC2|Beanstalk|Lambda|
|Google Cloud|Compute Engine|App Engine|Cloud Functions|
|Azure|Virtual Machines|App Service|Azure Functions|


---

# Linuxサーバーを作成し、講義中に構成したサービスを動かして見よう！

---

## XServerを利用します。

[無料VPS | XServer VPS](https://vps.xserver.ne.jp/free.php)

メールアドレス登録→電話番号認証→サーバーイメージ作成 という手順を踏みます。

---

![img](.assets/image1.png)

---


![alt text](./assets/image2.png)


---


![alt text](./assets/image4.png)

---

ssh鍵の作り方

```bash
$ ssh-keygen
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/alex/.ssh/id_ed25519): Xserver-20250801
Enter passphrase for "Xserver-20250801" (empty for no passphrase):
Enter same passphrase again:
```


---

![alt text](assets/image5.png)

---

![alt text](assets/image6.png)

---

```bash
# ユーザー一覧を確認
ls /home

# 新規ユーザー作成
sudo adduser username
# ユーザーのパスワード設定
sudo passwd username
# sudoグループに追加（Ubuntu/Debian系）
sudo usermod -aG sudo username

```


---

ここから先は、動いているホストの確認と、NGINXの導入、SSL対応をデモします。

できるだけrootユーザーによるSSHは禁止した方が良いでしょう。



---

scp -r -i ~/.ssh/Xserver-20250801 ~/Documents/works/山口産技RESTEC2025/2025-RemoteSensingSeminar/2025-07-25/handson/3-map tnk@x162-43-31-95.static.xvps.ne.jp:/home/tnk


---
## 一定額で使いやすいVPS

ConoHa VPS / さくらのVPS / AWS Lightsail


---

# Docker編

[AppRun β コントロールパネル](https://secure.sakura.ad.jp/apprun/applications)

[コンテナレジストリ一覧](https://secure.sakura.ad.jp/cloud/iaas/#!/appliance/containerregistry/)

---

アプリケーションをDocker用に修正

---

[AppRun β版 | さくらのクラウド マニュアル](https://manual.sakura.ad.jp/cloud/manual-sakura-apprun.html)

[コンテナレジストリ | さくらのクラウド マニュアル](https://manual.sakura.ad.jp/cloud/appliance/container-registry/index.html)

---

## 気をつけるべきこと

* Dockerコンテナのサイズ
* ビルドイメージ
* 環境変数


---

## ライブコーディング中に出会ったエラー

```bash
 => ERROR [builder 4/6] RUN npm ci --only=production                          2.2s
------
 > [builder 4/6] RUN npm ci --only=production:
1.159 npm warn config only Use `--omit=dev` to omit dev dependencies from the install.
2.032 npm error code EUSAGE
2.032 npm error
2.032 npm error The `npm ci` command can only install with an existing package-lock.json or
2.032 npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
2.032 npm error later to generate a package-lock.json file, then try again.
2.032 npm error
2.032 npm error Clean install a project
2.032 npm error
2.032 npm error Usage:
2.032 npm error npm ci
2.032 npm error
2.032 npm error Options:
2.032 npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
```

→ `npm ci --only=production` を `npm install` に変更<br>もしくは、npm installを事前にかけて置くとciを突破できる模様


---


コンテナレジストリに登録→コンテナイメージを選択して、起動するコンテナの設定を行う

---

maphandson2025-08-01.sakuracr.jp/field-survey-app:latest

---


## トレンドの話


---

# Cloudflareを使おう！

---

ExpressがCloudflare Workersで動くようになるかも
https://github.com/cloudflare/workerd/pull/4549


---

# Supabaseを使おう！


---

## オリジンとは？

---

## Jamstackという考え方

---

おまけ (アイディアなど)

---

PLATEAUのデータを使っていろいろ...

* マインクラフトに変換する


---

![alt text](./assets/image3.png)

---

* DEMを表示
* 天気予報図を作ろう
* [地図記号](https://www.gsi.go.jp/kohokocho/map-sign-tizukigou-2022-itiran.html)を使って地形図を作ろう(地図帳でよく見るやつ)
* 空想地図コンバータ(OpenGeoFictionを使った空想地図作成など)

---

### 一番大きいニュース

[AlphaEarth Foundations helps map our planet in unprecedented detail - Google DeepMind](https://deepmind.google/discover/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/)

---

## OSMからベクターマップを作ろう！

```bash
# osm2pgsqlでPostGISにインポート
osm2pgsql -c -d osm -S openstreetmap-carto.style japan.osm.pbf

# OpenMapTilesでタイル生成
docker run -v $(pwd):/data openmaptiles/openmaptiles-tools generate-vectortiles
```

---


```bash
# pg_tileservを使用（リアルタイム配信）
docker run -p 7800:7800 \
  -e DATABASE_URL=postgres://user:pass@host/db \
  pramsey/pg_tileserv

```

```bash

# ogr2ogrでGeoJSON経由
ogr2ogr -f GeoJSON output.geojson \
  PG:"host=localhost dbname=mydb" \
  -sql "SELECT * FROM buildings"

```

---

画像ファイルやshapefileを元にpbfを作成したい
→tippecanoe

```bash
# 直接tippecanoeで処理
ogr2ogr -f GeoJSON - input.shp | \
tippecanoe -o output.pmtiles \
  --no-feature-limit \
  --no-tile-size-limit
```


---

# この講義を通しての振り返り


昨年度のセミナー内容は、
### Web開発初心者でもWebGISに触れるようにしよう！
というミッションの元に進めており、
今年度(2025年度)セミナーでは、そこから一歩進んで、**DBを含んだ永続的なデータの保存環境、Webへのデプロイを含めたWeb開発の全体像を学ぶ**ことを目指しました。

---

## おまけ

---

### 確認メールの送信のおすすめ

認証において二段階認証で本人確認をするお話で、メール認証について触れましたが、
メールを送るためのAPIが公開されているサービスもあります。

ReSend / SendGrid


---

## 今回の講義で紹介した書籍

[Software Design総集編【2018～2023】 | 技術評論社](https://gihyo.jp/book/2024/978-4-297-14471-5)



---

書籍としてお持ちした、PLATEAUアカデミーで配布される*マニュアル*は、G空間センターやAIGIDにお尋ねするといただけるそうです。(2024年末の情報)

今年度2025年度も各地で開講されます。

土地計画基礎調査で市町村に各測量会社さんが作られたデータに対して各種属性や3Dモデルの情報の付加、CityGMLの検修などが対象範囲です。
非常に人手がかかる作業で、関わられる会社さんが増えることを応援しています。

[PLATEAUアカデミー | (一社)社会基盤情報流通推進協議会](https://aigid.jp/plateauacademy/)
