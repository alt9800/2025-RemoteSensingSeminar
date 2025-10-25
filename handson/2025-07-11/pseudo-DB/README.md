
[IndexedDBを使う](./useIndexedDB/)


この様な感じでデータが格納されます。
```json
{id: "1752792726584", coordinates: [139.70377655029148, 35.728154509073775], timestamp: "2025-07-17T22:52:06.584Z", description: "test", imageBlob: File}
```

Cmd + Shift + R などでリロードするとDBアクセスができるかも。


コンソールを使ってデータの中身を直接みてもいいかも。

```js
// IndexedDBの内容を直接確認
const request = indexedDB.open('PotholeDB', 1);
request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['potholes'], 'readonly');
    const store = transaction.objectStore('potholes');
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = () => {
        console.log('保存されているデータ数:', getAllRequest.result.length);
        console.log('データ内容:', getAllRequest.result);
    };
};

```



---



[ファイルの読み書きをDBがわりにするパターン](./useNodejs/)
```
node minimal-server.js
```
ブラウザで http://localhost:3000 を開くだけ。
(package.jsonもない)

---

[WASMを使う](./useDuckDB/)

---


[ローカルストレージを使う](./useLocalStorage/)

