---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第二回 2025/06/27"

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

第二回 2025/06/27

担当講師 : 田中聡至

---

## 本日のテーマ

## MapLibreを用いたWebGISのフロントエンド開発

MapLibre GL JS を例に、Webフロントエンドにおけるデファクトスタンダードな地理空間情報処理を平易に体験することを目標とする。

---

今回触れないこと
Javascriptの文法
→必要があれば即習のような手配を行います。

---

13:30-13:40	イントロ : 先週の振り返りや質問対応
13:40-14:30	MapLibreを動かすまでの設定
14:30-14:45	色々なデータが読み込めることを見てみよう
14:45-14:50	-----(休憩)-----
14:50-15:30	Leafletや他のライブラリとの比較をしてみよう
15:30-16:00	(プチアイディアソン) システムを思案しよう

---

# MapLibre GL JSとは？

Mapbox社が開発しているMapbox GL JSが開発していく中で、Mapboxのシステムを利用するOSS開発体制となったため、オープンプラットフォームで利用しやすく、かつ独立して開発できる体制を保つためにフォークして開発が始まったらWebGLベースの地図表示ライブラリです。

WebGLベースであることを活かして、3Dの演算も行え、Globeビューなども提供しています。


---

## Map Libre　GL JSで作られた面白いプロダクトs


---

## MapLibre　GL JSを導入しよう

---




二種類の読み込み方が可能です。

* npm
* CDN


---

## npmを使って読み込む

(Node.jsをインストールしている前提で)

npm install maplibre-gl




---

## npmを使うとなにが嬉しいか

npmを用いることで一通りライブラリをPCの中にインストールして置けるので、インターネットがない環境でもローカルにおける開発をすることができる。


---


```html:index.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MapLibre GL JS - npm版</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="main.js"></script>
</body>
</html>

```

---

```js:main.js
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
    center: [139.7670, 35.6814], // 東京駅
    zoom: 10
});

// ナビゲーションコントロールを追加
map.addControl(new maplibregl.NavigationControl());

// 地図の読み込み完了時の処理
map.on('load', () => {
    console.log('地図の読み込みが完了しました');
});

```


---

## 実際に実行してみましょう


```bash
npm install --save-dev parcel

```


```package.json
{
    "scripts": {
        "dev": "parcel index.html",
        "build": "parcel build index.html"
    }
}
```


---

* jsの名前はmain.jsやindex.jsが好まれます。
* scriptディレクトリを作成し、その中にコレクションしても良いですし、htmlと同階層においてもOK。

他には parcel や webpackによるバンドルが行われてきました。。



---







---



## CDNから読み込む

`<head>`タグの中で記述することでライブラリを読み込み読み込めます。

バージョン指定
```html
<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
```
一番最新のものを呼びだす
``html
<link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
```



---

```html

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <title>MapLibre GL JS - CDN版</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- MapLibre GL JS CSS -->
    <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet">
    
    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <!-- MapLibre GL JS JavaScript -->
    <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
    
    <!-- 地図の初期化 -->
    <script>
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
            center: [139.7670, 35.6814], // 東京駅
            zoom: 10
        });

        // ナビゲーションコントロールを追加
        map.addControl(new maplibregl.NavigationControl());

        // 地図の読み込み完了時の処理
        map.on('load', function() {
            console.log('地図の読み込みが完了しました');
        });
    </script>
</body>
</html>

```


---

# 補足記事


---


# npmとは？　(Node Package Manage)
JavaScriptのパッケージ管理ツールで、Node.jsのエコシステムにおいて、ライブラリのインストールや管理、共有を行うことができます。
(他の開発者と環境を揃えることに役に立つ。)

2009年にNode.jsが登場したのち、次の年にはnpmはリリースされていたようです。


---


# CDNとは？ (Content Delivery Network)
Webコンテンツをインターネット系で配信/利用するために用意されたネットワーク網のこと。
ネットワーク網の中で負荷分散がされることによって、アクセスの集中などに強く、静的なコンテンツをアプリケーションサーバーでの処理を介さずに返すことができる。
Web開発の文脈では、CDNやJSを配信することで、html内から呼び出して、適用することができる。

類似技術 : Webサーバー(NGINXなど)、DNS


---

## CDNのサービス

* jsDelivr
* CDNJS 
* unpkg
* Cloudflare
* Akamai 
* Fastly
* Microsoft Azure / Google Cloud / AWS にもそれぞれサービスがあります。


---

# Javascriptが動く仕組み

Javascriptも機械語にコンパイルすることでコンピュータに解釈され動作します。
特に、Javacriptは「ブラウザ」によってコンパイルされ処理を返すことができることが特徴です。
Node.jsにおいてはJSをコンピュータ内が解釈できる形にして処理を返す点は他の高級言語(C、Python、Rubyなど)と同様といえます。
コンパイラとしてV8エンジンがNode.jsやChrome(Chromium)では活用されています。(Google Apps ScriptでもV8エンジンでJavacriptを利用しているそうです。)


---

## ランタイムについて

Javascriptの実行環境としては最近では DenoやBunのような代替が誕生しています。
DenoではTypeScriptがサポートされていたり、ライブラリの導入がかなり簡略化されていて、パッケージ管理が楽になっています。また、マルチスレッドであるため、並列なプログラミングを行うことができます。
BunはそもそもZigによって処理を高速化しているのでかなりハイパフォーマンスな実行速度を誇ります。JavaScirptの実行環境としても、バンドル速度としても、既存のランタイムと差別化できていると言えるでしょう。



---

## npmを利用してJavascriptをサーバーサイドで動かしてみよう




---

## TypeScriptも動かせます


---


## その他の実行環境について




---

## node_moduleとは

npm でインストールしたJavascriptのライブラリがモジュールとして格納される**ディレクトリ**です。

npmにはJavascriptのライブラリにとどまらずPC全体で使える便利なライブラリもあり(Gemini codeとか)、
ホームディレクトリにPC全体で使えるコマンドをインストールすることもあります。(グローバルインストール)

(win-get , homebrew , apt に相当する使い方)

---

## package.jsonとは

package.jsonはJSを用いた開発における設計図の役割を果たします。
依存関係の管理
スクリプトの定義
バージョン管理を行えます。

npm install --save-dev npm install --saveでインストールすると自動で記載してくれます。

これを他の開発者に渡すことで、package.jsonが存在する階層でnpm installをしてもらえば同じ環境を用意しやすいです。

package-lock.jsonではライブラリ間の依存関係や互換性のあるバージョンの担保などがされます。

ちなみに、gitの追跡はpackage.jsonとpackage-lock.jsonをしておけば、node_modules/を追跡する必要はありません。

---

## フロントエンド事情

最近ではDockerによる開発もされているが、講師個人としてはフロントエンドでDocker開発はやや冗長かも。

また、npmに変わって、yarnやpnpmなども使われるようになってきています。


---

## JSONとはどのような構造か


---

## WASM(WebAssembly)とは

最近のWebフロントにおいては、ネイティブの動作をWebに移植する目的で、Web上でJavascriptのAPIを利用してインスタンスを作成して実行するバイナリをJavascriptと連携して配置することが増えています。

→ネイティブの重い処理の移行例としてはUnityのWebGLビルドであったり、ffmpegのWeb移植の例などがあります。

---

## Javascriptの標準化について

Javascriptにおける機能の合意などの標準化についてはEuropean Computer Manufacturers Association(ECMA)が行なっており、さまざまな実行環境での共通化に取り組んでいます。
現行のJavascriptはECMAScript 6(2015)とも呼ばれます。

`let`によるレキシカルスコープ、アロー関数を用いたthisバインディングの一つ上の階層への固定化によるコールバックの簡便化、バッククオートを用いたバインディング、クラス構文、import/exportによるモジュールの活用、Promise型の導入による非同期処理の強化、などが目玉でした。

---


使いやすい書籍



ハンズオンJavaScript オライリー
https://www.oreilly.co.jp/books/9784873119229/
どのような感じでJavascriptが動いているか、標準ライブラリにはどのようなものがあるか(Javascriptがどのようなことができるか)といったことがサーバーサイドJSのベテランの目線でまとまっています。


現場のプロがわかりやすく教える 位置情報エンジニア養成講座 秀和システム
https://www.shuwasystem.co.jp/book/9784798068923.html
MapLibreを活用したWebフロントについての詳細な解説がなされています。


これからWebをはじめる人のHTML＆CSS、JavaScriptのきほんのきほん マイナビブックス
https://book.mynavi.jp/ec/products/detail/id=65861
社内に広く、マークアップから動的なWebについて伝える際にあると便利な一冊です。



---

## gitの使い方についての補足

空の「ディレクトリ」は管理対象に取れないことに注意


---


## 今週のジオニュース

帝国書院さんのジオグラフ (2021)がにわかに盛り上がっている
https://www.geograph.teikokushoin.co.jp



---

アンケート

Markup(html / css / Javascript)の開発経験について教えてください。
また、同時に、普段、どのような言語での開発業務に携わっているかを記載ください。

本年度、および来年度の解説の指標になります。