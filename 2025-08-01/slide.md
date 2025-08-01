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

---


今回使うのは

## AppRun β (さくらインターネット) : コンテナ環境
## Xserver VPS : ベアメタル環境


(ハンズオンとしては講師に追従することを必要としませんが、もし、一緒の速度でやりたい場合はそれぞれのアカウントをご用意ください。)


---

Dockerでやるか ローカルで環境を作るか

サーバーサイドのパッケージ管理について

どこにデプロイするか


---

# アプリケーションのデプロイ

---

## どこで動かすか

## どうやって動かすか

## 何を動かすか

---




* 静的サイトホスティング
* 

---

# 色々な場所でシステムを動かそう！

---

## Linux環境下で動かす

Linux環境下にNode.jsなどが動く環境を用意して動かします。


---

## そもそもLinux慣れてない方向けのアイディア
Cloud Run ([Google Cloud]、[さくらインターネット])を試す

Dockerを入れる

VagrantやVMwareを入れる

---

## AWSで動かす

EC2 は基本的にVPSのように使うことができます。

---

### 最小構成

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Route 53  │────▶│  EC2インスタンス  │────▶│  EBS Volume  │
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
│ CloudFront │────▶│ Elastic Beanstalk│────▶│    RDS     │
│   (CDN)    │     │  - Node.js       │     │ (PostgreSQL)│
└────────────┘     │  - Auto Scaling  │     └────────────┘
                   │  - Load Balancer │            │
                   └──────────────────┘            ▼
                            │                  ┌────────┐
                            └─────────────────▶│   S3   │
                                               │(Images)│
                                               └────────┘
                                              


---

## 〇aaSとは?

*Platform as a Service* をはじめとするエンタープライズのサービス群を指します。

* Infrastructure as a Service
* Platform as a Service
* Backend as a Service

などなど



---

## エッジで(サーバレスとして)動かす

サーバレスアーキテクチャとは?
→特定の機能のみを実行する組み合わせで構成されるアプリケーション
(〇〇Function のような名前のサービスであることが多いです。)



---


||VPS|非rootサーバー|サーバレス|
|---|---|---|---|
|Amazon Web Services|EC2|Beanstalk|Lambda|
|Google Cloud|Compute Engine|App Engine|Cloud Functions|
|Azure|Virtual Machines|App Service|Azure Functions|


---

## トレンドの話


---

# Cloudflareを使おう！

---

ExpressがCloudflare Workersで動くようになるかも
https://github.com/cloudflare/workerd/pull/4549


---

# Supabaseを使おう！




## オリジンとは？


---

Jamstackという考え方

---

おまけ (アイディアなど)

---

PLATEAUのデータを使っていろいろ...

* マインクラフトに変換する


---

* DEMを表示
* 天気予報図を作ろう
* [地図記号](https://www.gsi.go.jp/kohokocho/map-sign-tizukigou-2022-itiran.html)を使って地形図を作ろう(地図帳でよく見るやつ)

---

空想地図コンバータ

OpenGeoFiction

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

この講義を通しての振り返り


---

昨年度のセミナー内容は、
### Web開発初心者でもWebGISに触れるようにしよう！
というミッションの元に進めており、
今年度(2025年度)セミナーでは、そこから一歩進んで、**DBを含んだ永続的なデータの保存環境、Webへのデプロイを含めたWeb開発の全体像を学ぶ**ことを目指しました。

---