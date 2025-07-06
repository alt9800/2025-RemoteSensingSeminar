---
marp: true
theme: gaia
paginate: true
backgroundColor: #fff
---

<!-- _class: lead -->

### FOSS4G 2025 KANSAI ハンズオンデイ
# すこし”Deep”なLeaflet エコシステム
### インタラクティブな地図アプリケーション開発

---

https://www.osgeo.jp/events/2025-2/foss4g-2025-kansai/foss4g-2025-kansai-ハンズオンデイ#Deep

---

# アジェンダ

1. **Leaflet基礎** - 地図の表示と基本操作
2. **インタラクティブ機能** - ドラッグ&ドロップ、メニューバー実装
3. **Firebase連携** - リアルタイムCRUDシステム
4. **高度な可視化** - ヒートマップと地図分割表示
5. **パフォーマンス最適化** - 大量データの効率的な描画

---

<!-- _class: lead -->

# 第1章
## Leaflet基礎編

---

# Leafletとは？

- **軽量**で**モバイルフレンドリー**なJavaScript地図ライブラリ
- **オープンソース**で豊富なプラグイン
- 主要なブラウザで動作

```javascript
// 基本的な地図の初期化
var map = L.map('map').setView([34.180873, 131.469966], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

---

# 実装例1: 背景地図の切り替え

```javascript
// OpenStreetMapレイヤー
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// 航空写真レイヤー
var satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);

// レイヤーコントロールの追加
L.control.layers({
    "OpenStreetMap": osmLayer,
    "航空写真": satelliteLayer
}).addTo(map);
```

---

# 学びのポイント：タイルレイヤー

- **タイルサーバーの選択**
  - OpenStreetMap（無料、制限あり）
  - 地理院タイル（日本向け）
  - 商用サービス（Mapbox、Google Maps）

- **パフォーマンスの考慮**
  - タイルのキャッシュ
  - 適切なズームレベルの設定

---

<!-- _class: lead -->

# 第2章
## インタラクティブ機能の実装

---

# 実装例2: GeoJSONドラッグ&ドロップ

```javascript
map.getContainer().addEventListener('drop', function(e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    
    reader.onload = function(event) {
        var geoJsonData = JSON.parse(event.target.result);
        L.geoJSON(geoJsonData, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800"
                });
            }
        }).addTo(map);
    };
    reader.readAsText(file);
});
```

---

# 実装例3: インタラクティブなメニューバー

```javascript
// ズームレベル制御
function changeZoom(value) {
    map.setZoom(value);
    document.getElementById('zoomLevel').textContent = 
        'ズームレベル: ' + value;
}

// マーカーの表示/非表示
function toggleMarkers() {
    if (markersVisible) {
        map.removeLayer(markers);
    } else {
        map.addLayer(markers);
    }
    markersVisible = !markersVisible;
}
```

---

# 学びのポイント：ユーザビリティ

- **直感的な操作**
  - ドラッグ&ドロップでファイル読み込み
  - スライダーでズーム調整

- **視覚的フィードバック**
  - ホバー効果
  - アニメーション

- **レスポンシブデザイン**
  - モバイル対応
  - タッチ操作のサポート

---

<!-- _class: lead -->

# 第3章
## Firebase連携とCRUD操作

---

# 実装例4: Firestoreとの連携

```javascript
// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// マーカーの追加
const newMarker = {
    Comment: comment,
    Location: new GeoPoint(lat, lng),
    CreatedAt: serverTimestamp(),
    userName: userName
};

await setDoc(doc(db, 'LatLngs', mapName, 'markers', id), newMarker);
```

---

# リアルタイムデータ同期

```javascript
// マーカーの読み込みと表示
async function loadMarkers() {
    const querySnapshot = await getDocs(
        collection(db, 'LatLngs', selectedMap, 'markers')
    );
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const marker = L.marker([
            data.Location.latitude, 
            data.Location.longitude
        ]).addTo(map)
          .bindPopup(`<b>${data.userName}</b><br>${data.Comment}`);
    });
}
```

---

# 学びのポイント：データ管理

- **NoSQLデータベースの活用**
  - GeoPointでの位置情報管理
  - タイムスタンプによる履歴管理

- **CRUD操作の実装**
  - Create: 新規マーカー追加
  - Read: マーカー一覧表示
  - Update: コメント更新
  - Delete: マーカー削除

---

<!-- _class: lead -->

# 第4章
## 高度な可視化技術

---

# 実装例5: ヒートマップ表現

## Leaflet.heat
```javascript
var heatData = [
    [34.180873, 131.469966, 0.5],
    [33.968776, 130.940482, 0.5],
    // ...
];

L.heatLayer(heatData, {
    radius: 50,
    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
}).addTo(map);
```

---

# 複数の実装方法比較

| ライブラリ | 特徴 | 用途 |
|-----------|------|------|
| **Leaflet.heat** | 軽量、簡単 | 基本的なヒートマップ |
| **MapLibre GL** | GPU活用、高速 | 大量データ |
| **Deck.gl** | 3D対応、高機能 | 高度な可視化 |

---

# 実装例6: Side-by-Side地図比較

```javascript
// 2つのレイヤーを左右に分割表示
L.control.sideBySide(gsiLayer, osmLayer).addTo(map);

// カスタムディバイダーの実装
_onDividerDrag: function(e) {
    var rect = this._container.getBoundingClientRect();
    var percent = (e.clientX - rect.left) / rect.width;
    this._updateClip();
}
```

---

# 学びのポイント：UI/UX設計

- **比較機能の実装**
  - スワイプ操作で直感的な比較
  - 同期スクロール

- **カスタムコントロール**
  - 独自UIコンポーネントの作成
  - イベントハンドリング

---

<!-- _class: lead -->

# 第5章
## パフォーマンス最適化

---

# 大量データの効率的な描画

```javascript
// GeoJSONデータの最適化
L.geoJSON(data, {
    style: function(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 1,  // 細い境界線
            fillOpacity: 0.7
        };
    },
    // シンプルなポップアップ
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name);
    }
}).addTo(map);
```

---

# パフォーマンス改善テクニック

1. **データの軽量化**
   - 座標精度の調整
   - 不要なプロパティの削除

2. **レンダリング最適化**
   - Canvas vs SVG の選択
   - クラスタリングの活用

3. **遅延読み込み**
   - ビューポート内のみ表示
   - ズームレベルに応じた詳細度

---

# 実装例7: マーカークラスタリング

```javascript
// 多数のマーカーをクラスタリング
var markers = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: true
});

// マーカーを追加
data.forEach(function(item) {
    var marker = L.marker([item.lat, item.lng]);
    markers.addLayer(marker);
});

map.addLayer(markers);
```

---

<!-- _class: lead -->

# まとめと次のステップ

---

# 学んだこと

✅ **基礎技術**
- Leafletの基本操作とレイヤー管理

✅ **インタラクティブ機能**
- ドラッグ&ドロップ、動的UI

✅ **データ連携**
- Firebase/Firestoreとのリアルタイム同期

✅ **高度な表現**
- ヒートマップ、地図比較

✅ **最適化**
- パフォーマンスチューニング

---

# 次のステップ

1. **プラグインの活用**
   - Leaflet.draw（図形描画）
   - Leaflet.routing（経路検索）

2. **モバイル最適化**
   - タッチジェスチャー
   - オフライン対応

3. **セキュリティ強化**
   - Firebase認証
   - データ検証

---

# リソースとドキュメント

- **公式ドキュメント**
  - [Leaflet公式](https://leafletjs.com/)
  - [Firebase Docs](https://firebase.google.com/docs)

- **サンプルコード**
  - GitHub: `/Seminar/`
  - CodePen examples

- **コミュニティ**
  - Stack Overflow
  - Leaflet Forum

---

<!-- _class: lead -->

# ご質問はありますか？

## 実装でお困りのことがあれば
## お気軽にお聞きください！

### Happy Mapping! 🗺️