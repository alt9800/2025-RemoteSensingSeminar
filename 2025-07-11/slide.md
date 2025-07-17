---
marp: true
theme: default
header: "衛星データ解析技術研究会<br>技術セミナー（応用編）"
footer: "第三回 2025/07/11"

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

第三回 2025/07/11

担当講師 : 田中聡至

---

## 本日のテーマ

### バックエンド開発① 
## バックエンドとは / サーバ環境の構築 



---

👦連絡 : ハンズオン資料に **2025-07-06** という欠番回が追加されていると思いますが、これはFOSS4G Kansai 2025にて講師が実施した`少しDeepなLeaflet`という、2024年度の衛星データ解析技術研究会 技術セミナー（応用編)の焼き直し講義の資料です。お暇な人はどうぞ。

---

## 前回やったこと

Node.jsが動く環境設定 / MapLibreの読み込み方


---


### 7/11(金)　13:30-16:00

~~13:30-13:50	前回までの復習 (フロントについてもう少し詳しく)~~
~~13:50-14:30 最終的にはこういうのをつくるよ、という例~~
14:30-14:40	-----(休憩)-----
~~14:40-16:00 データの保存をするところから~~
資料作成時点と予定が変わりました (次のページ)

---

### 7/11(金)　13:30-16:00

13:30-13:50	最終的にはこういうのをつくるよ、という例 (Docker実装)
13:50-14:30 実装解説 
14:30-14:40	-----(休憩)-----
14:40-15:30 擬似ファイル読み込みの例いろいろ
15:30-16:00 MapLibreの基本機能を見ていこう (アイコンの表示、ラインの表示など)


---

## 今後の全体像

### バックエンド開発①
バックエンドとは / サーバ環境の構築

### バックエンド開発②
動的なWebアプリとは

### バックエンド開発③
フロントエンドとの接続

### バックエンド開発④
デプロイ

---

## [セミナー募集時点での内容]
昨年度のカリキュラムにおいて作成を行なったFirebaseを用いた現地調査ツールを参考に、WebGISにおける、データの永続化が図れている環境についてポイントの解説を行う。
上記を踏まえたうえで、Webアプリケーションのデプロイとはなにか、どのような環境(PaaS / IaaS)が存在するのかに加え、バックエンドとミドルウェアについて学ぶ。
セミナー最終回までに実装を行うシステムについての全体像を掴むことを目標とする。

---

> 動的なWebアプリケーションとは？
### DBに保存された値によってフロントに表示される値が変わるサイト

Leaflet + Firebase (FireStore , CloudStorage)
https://project-4415519406887009516.web.app


(第一回で触れている内容です)

---

# 第六回までで完成する予定のアプリ

---


Dockerを使うと何が嬉しいか？



---

## 機能要件 (現地調査ツールをイメージしながら)

- メールアドレスとパスワード(6文字以上)、一意のユーザID文字列の要件で登録
- ユーザID文字列 + パスワードでログイン可能
- (/) : 地図の表示機能 / クリックでモーダルが出現し、新規地点にコメント共に画像を投稿する画面右側にはテーブルが出現 , (/Signup) , (/login) ,  (/mypage) : 自身の投稿一覧の管理 , (/logout)
- ヘッダーにトップへの回帰ボタン(「システム」の文字)と非ログイン状態だとログインボタンとサインインボタンを、ログイン状態だとマイページボタンとログアウトボタンを用意
- すべてのページはindex.htmlで静的に管理し、それぞれのフォルダが機能の名前になる構造である。
- 地図はMapLibreGL JSを用いてCDNでライブラリを読み込むような形式 (フロント)


---

## サーバーサイドがあるとどういう点で嬉しいか

クライアントサイド(JSやマークアップによる実行環境)だけでは不可能な処理を行うことができます。

主に
**DBへの書き込み、セッション管理**とそれによって実現可能な技術が利用できるようになります。

CLIによるコマンドをバックグラウンドで独立して動かすことでさらに色々な処理を並行で行うこともできる。
地理空間情報においては
タイルサーバーやリアルタイムの同期処理(Socketなど)やデータ分析・機械学習基盤の運用なども可能になるでしょう。
バッチジョブなどこの階層に含まれます。(最新の衛星データを取得してきてコレクションし、Webアプリ側からも参照できるようにする、など。)


---



## Webアプリを支える要件

- ルーティング (View)
- マークアップ(テンプレート)エンジン (View)
- データベースの読み書きやその抽象化 (Model)
- 認証認可 (Model)
- これらの制御 (Controller)


これらの機能をやさしく扱えるようにするための仕組みがWebフレームワークには揃っています。

---

# MVCアーキテクチャ

Model-View-Controller

フルスタックと言われるWebフレームワークで採用されているよく「形式」です。

C# のASP / JavaのSpring / Ruby on Rails / PHPのLaravel などもMVCのアーキテクチャを採用しています。


---

### シンプルなリクエストの例がDBやViewの構築までどの様に伝わるか
```
     ┌─────────────┐
     │   User      │
     └──────┬──────┘
            │ Request
            ▼
     ┌─────────────┐
     │ Controller  │ <─── "Traffic Director"
     └──┬───────┬──┘
        │       │
  Update│       │Select
        ▼       ▼
┌───────────┐ ┌───────────┐
│   Model   │ │   View    │
│           │ │           │
│ Business  │ │ Display   │
│  Logic    │ │  Logic    │
└───────────┘ └───────────┘
    "Data"      "UI"
```

---

## 他のアーキテクチャ構造

オニオンアーキテクチャ / マイクロサービス など


---


## Node.jsのフレームワーク

- Express
- Fastify
- NestJS
- Koa
- Hono

---

## Pythonのフレームワーク

- Flask
- Django
- FastAPI


---

# データを擬似的に永続化する手段

---

[IndexedDBをつかう](./pseudo-DB/useIndexedDB/)


---

[ローカルストレージを使う](./pseudo-DB/useLocalStorage/)


---

[DuckDBを使う](./pseudo-DB/useDuckDB/)


---


[Node.jsを使ってファイル書き込みをするパターン](./pseudo-DB/useNodejs/)


---

(クッキーやセッションストレージについて)


---

ここからはcsvやjsonのファイルの読み込みについて復習しておきます。

💡 ローカルのファイルを読んでいるのか、HTTPでファイルをリクエストしているのかはよく考えましょう。

---

## CSVを読み込みたい <span class="tiny-text">CSV形式からデータを取り出す / ローカルで読み込む</span>

```js
fetch('path/to/your/file.csv')
  .then(response => {
    // レスポンスのステータスをチェック
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(csvText => {
    // CSVテキストを行に分割
    const rows = csvText.split('\n');
    
    // データを格納する配列
    const data = [];
    
    // ヘッダーを取得
    const headers = rows[0].split(',');
    
    // データ行を処理
    for (let i = 1; i < rows.length; i++) {
      // 空行をスキップ
      if (rows[i].trim() === '') continue;
      
      const values = rows[i].split(',');
      const rowObject = {};
      
      // オブジェクトに変換
      headers.forEach((header, index) => {
        rowObject[header.trim()] = values[index] ? values[index].trim() : '';
      });
      
      data.push(rowObject);
    }
    
    // 処理したデータをコンソールに出力
    console.log(data);
  })
  .catch(error => {
    // ネットワークエラーや他の例外をキャッチ
    console.error('CSVの読み込み中にエラーが発生しました:', error);
  });
```
---

☝️ ページ読み込み時(Javascript実行時)にcsvを読み込む方法で基本的には問題ないと思いますが、同じ形式のcsvで、読み込むファイルが複数あり、ユーザ側で選びたい場合は、DOMと連動した読み込みポイントを作ると良いかもしれません。


---

### 復習 : ファイルを読み込みたい時

* Ajax (jQuery)
* XMLHttpRequest (従来的によく実装で使われてた)
* Axios (やや新しめのHTTP処理クライアント)

できるだけWeb標準を使いたいという気持ちがあれば前項の**FetchAPI**を使うことをお勧めします。

なお、サーバーサイドとして、Node.jsがある場合は`fs`でファイルを読み込んでNode.js内で処理するパターンが多いでしょう。
また、ブラウザ上で`FileReader API`を使うとローカルファイルを読み込むことができます。


---

## 💡検討ポイント

### 設計において列ごとに緯度経度を分けるか否か

```
|latitude|longitude|
|33.9519|131.2467|
```

```
|geometory|
|131.2467,33.9519|
```

csvは結局、Javascriptで扱える型(オーソドックスには配列、オブジェクト型に変換しても良い)への処理を自分で設計しなければいけないことの方が多いかもしれません。

各セルに入る項目にもJSONと異なり「型」が存在しないので、区切り方も自由度が高いです(良し悪し。とはいえ、プログラムでパースすることに念頭においたCSVの構造設計を心がけた方が良いと思います。)

---

🐤 CSV読み込みの難しさ 🐤

どこの列に地理情報が入っているか分かった上で、値を活用する部分の処理を書かなくてはいけないことが多いでしょう。

→ 読み込んだあとでどの列の項目を使うか、csvからTableを作成し、必要な項目を選んで地図上にプロットする方法など取れます。
(https://alt9800.github.io/2025-RemoteSensingSeminar/handson/2025-07-11/csv-perse)

💡 ヘッダー行を設定の有無を気をつけましょう！
💡 空のセルをスキップ(しつつ、読み込めなかった行をconsole.logに出すなど)する実装をすると汎用的かも！
💡 改行文字による処理ミスもあるあるです。

---

## ☝️ローカルのCSVファイルを選んでテーブルにしてみよう

---

DOM側
```html
<!DOCTYPE html>
<html>
<body>
  <input type="file" id="csvFileInput" accept=".csv">
  <table id="csvTable"></table>

  <script src="script.js"></script>
</body>
</html>
```
次ページにScript

---
```javascript
document.getElementById('csvFileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const csvText = event.target.result;
    const rows = csvText.split('\n');
    const table = document.getElementById('csvTable');
    
    // テーブルをクリア
    table.innerHTML = '';

    rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      const cells = row.split(',');

      cells.forEach(cell => {
        const td = document.createElement(index === 0 ? 'th' : 'td');
        td.textContent = cell.trim();
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  };

  reader.readAsText(file, 'UTF-8');
});


```

---

### 💡 csvの読み込みに際して拡張ライブラリを利用したい

CSV-Parse
Papa Parse

などがよく使われているほか、データの可視化まで検討するのであれば、第一回で触れたd3.jsなどを使うのも手かもしれません。

これらのライブラリで助かるのは、形式変換よりもむしろ**正規表現**の処理です。

---


### おまけ : 住所しかデータがない場合
CSISのシステムで住所情報を一括で緯度経度に変換することができます。
https://geocode.csis.u-tokyo.ac.jp/geocode-cgi/geocode.cgi?action=start

キーワード : ジオエンコード / ジオデコード

💡 文字コードはWindowsをお使いの方もUTF-8を利用する方がよいです。

---

## GeoJSONを読み込みたい

```js
fetch('path/to/your/file.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(geojsonData => {
    // GeoJSONデータの基本的な検証
    if (geojsonData.type && ['FeatureCollection', 'Feature', 'Point'].includes(geojsonData.type)) {
      console.log('GeoJSON読み込み成功:', geojsonData);
      
      // 追加の処理例
      if (geojsonData.type === 'FeatureCollection') {
        console.log('フィーチャー数:', geojsonData.features.length);
      }
    } else {
      console.warn('無効なGeoJSON形式');
    }
  })
  .catch(error => {
    console.error('GeoJSONの読み込み中にエラーが発生しました:', error);
  });
```
---

💡 GeoJSONについては通常のJSONに対して、よりいっそう形式が決まっているので、概ね同じ方法でObject型の変数として扱いやすいです。



---
### GeoJSONの構成について

#### ジオメトリタイプ:
Point: 単一の位置点
LineString: 連続した線
Polygon: 閉じた多角形
MultiPoint: 複数の点
MultiLineString: 複数の線
MultiPolygon: 複数の多角形
GeometryCollection: 複数のジオメトリオブジェクト
#### フィーチャータイプ:
Feature: 単一のジオメトリと追加のプロパティ
FeatureCollection: 複数のフィーチャーのコレクション


---

### JSONを読み込むだけならさらに簡単

```js
fetch('path/to/your/file.json')
  .then(response => {
    // レスポンスのステータスをチェック
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // JSONとして直接パース
  })
  .then(data => {
    // 読み込んだJSONデータを処理
    console.log(data);
  })
  .catch(error => {
    // ネットワークエラーや解析エラーをキャッチ
    console.error('JSONの読み込み中にエラーが発生しました:', error);
  });
```

---
JSON型は構文がObjectと類似していることに加え、

**オブジェクト → JSON** は JSON.stringify();

**JSON → オブジェクト** は JSON.parse()

で容易に変換可能です 

---

## 筆ポリゴンを使ってみよう！


筆ポリゴンの例
https://www.maff.go.jp/j/tokei/porigon/index.html
(リンク https://open.fude.maff.go.jp)
筆ポリゴンの利用規約
https://opendata.fude.maff.go.jp/筆ポリゴンの利用規約.pdf

☝️ 筆ポリゴンからデータをDLしてみましょう

💡筆ポリゴンからダウンロードするデータは拡張子を`.geojson`にリネームする必要があります


---

## 便利なツール類

---

GeoJSON ( TopoJSON ) に加え、KML やShapefileは**Loaders.gl**を使うとよいでしょう。
(GeoTIFFやglTFのような形式も対応している様です。)



---


### Q. とりあえずどんなデータか見てみたい

### A.  Kepler.GLはどうでしょうか？
https://kepler.gl

deck.glとMapLibreGL JSのGIS・3Dライブラリに、Loaders.jsなどを組み合わせた可視化基盤です。


Try : 試しに筆ポリゴンのデータを読み込ませてみましょう


---

### Q.任意のGeoJSONを作りたい

### A Geojson.io が良いかも

https://geojson.io/

Mapbox社が提供しているWebアプリケーションで、
点を打ったりラインやポリゴンを描いたものをGeoJSON形式で保存できます。


---


こういう形式を知っておくと良いかも

* GeoParquet
* 3D tiles
* COG
* FlatGeoBuff
* GeoArrow (←AIくんが教えてくれました)


---

講義中に見たものいろいろ



---

[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)

[ArcGIS で Cloud Optimized GeoTIFF (COG) を触ってみる - フリーダムの日記](https://freedom-tech.hatenablog.com/entry/2023/08/20/210800)

[MapLibre GL JS+標高タイルで3D地形を表示する方法 #JavaScript - Qiita](https://qiita.com/shi-works/items/2d712456ccc91320cd1d)




---

トンネリングを用いてlocalhostの実行環境をインターネットに公開する。