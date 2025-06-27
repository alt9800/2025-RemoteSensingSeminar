## 説明

このページはサーバサイドでnode.jsを使ったプログラム実行の例を載せています。


1. [fizzbuzz](./fizzbuzz.js)
2. [平均値と中央値を求める問題](./statistics.js)
3. [APIcall](./apicall.js)

このフォルダをダウンロードして、nodeコマンドおよびnpmが入っている環境で、それぞれのファイルを実行するか、あるいはpackage.jsonに従ってコマンドを実行する必要があります。


例ではサーバーサイドJSのHTTPリクエストとしてAXIOSを用いていますが、Node.js 18からはなんとfetchがサーバサイドにおいても利用できるようになりました。
https://qiita.com/youtoy/items/cce17c02085f7d42dc34


おまけで、APIコールをフロントエンドに返すサンプルをつけています。
[画像取得](./onFrontend/)


### fetchの使い方


```javascript
fetch('https://anyuri')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
```

