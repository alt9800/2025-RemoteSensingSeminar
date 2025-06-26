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

13:30-13:40	イントロ : 先週の振り返りや質問対応
13:40-14:30	MapLibreを動かすまでの設定
14:30-14:45	色々なデータが読み込めることを見てみよう
14:45-14:50	-----(休憩)-----
14:50-15:30	Leafletや他のライブラリとの比較をしてみよう
15:30-16:00	(プチアイディアソン) システムを思案しよう

---

# MapLibre GL JSとは？




---

## MapLibre　GL JSを導入しよう

---


---


二種類の読み込み方が可能です。

* npm
* CDN


---


---



## CDNから読み込む

`<head>`タグの中で記述することでライブラリを読み込み読み込めます。

<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />




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