今回のハンズオンの内容


---

[最終的に目指す形](https://github.com/alt9800/2025-RemoteSensingSeminar/tree/main/2025-07-11/handson/app-complete/express)

readmeファイルが含まれており、ファイル構造の説明などが載っています。

動かし方も記載しておきます。


[上記のDockerを使った実装](https://github.com/alt9800/2025-RemoteSensingSeminar/tree/main/2025-07-11/handson/app-complete/expressonDocker)

前者の実装に対して、PostgresQLを使っていたり細かい違いはありますが概ね一緒です。

---

[CSVをテーブルとして表示した後に、項目を選択するパターン](./csv-perse/)


ドラッグアンドドロップで読み込んだCSVを、ユーザが緯度経度を設定して、地図上にプロットできます。

PapaParseでデータ構造を抽出する様にしているほか、文字コード上のエラーが内容に解析するステップを持っています。

少し改造すると、csvに「ジオメトリ」の形式で緯度経度のペアがあっても読み込めると思います。

---

[データのエクスポートをしてみる](./csv-n-json-export/)

ポイントデータを配列にオブジェクトを入れ子にしていく形式で、テーブルとしてもパースしやすくしていて、三つの形式へのエクスポートも容易にしています。。

```js
// ポイントデータを単一の配列で管理
let points = [];

// データ構造を一貫性のあるものに
const point = {
    id: nextId++,
    lng: lng.toFixed(6),
    lat: lat.toFixed(6),
    name: name
};
```

blobAPIの様なクライアント側でファイルを作成する様なメモリ管理ができる仕組みを使うと、エクスポートは容易になります。

```js
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);  // メモリリークを防ぐ
}
```

また、実はポイントを打つたびに(状態が変わるごとに)、テーブルを再描画しています。


---


[バックエンドが存在しない状態でデータの保存を行う手段色々](./pseudo-DB/)


[IndexedDBをつかう](./pseudo-DB/useIndexedDB/)



[ローカルストレージを使う](./pseudo-DB/useLocalStorage/)



[DuckDBを使う](./pseudo-DB/useDuckDB/)



[Node.jsを使ってファイル書き込みをするパターン](./pseudo-DB/useNodejs/)

動かし方

```


```