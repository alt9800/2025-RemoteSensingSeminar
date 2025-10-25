# 様々な背景地図を読み込もう！



地理院地図ベクターの表示は二癖くらいあります。
https://github.com/gsi-cyberjapan/gsivectortile-mapbox-gl-js

地図の切り替えは基本的にあらかじめレイヤーを複数読み込んでおき、上部にあるレイヤーを不可視化することで表示切り替えを行うことができます。


[地図切り替えのサンプル](./prj/)

[タイルマップの境界線について](./boundary/)




## Sentinelのデータを利用したい場合

いずれも登録が必要ですが、得られるデータの幅が違います。

### Sentinel Hub経由

```javascript
map.addSource('sentinel', {
    type: 'raster',
    tiles: [
        'https://services.sentinel-hub.com/ogc/wms/{YOUR_INSTANCE_ID}?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=TRUE_COLOR'
    ],
    tileSize: 256
});

map.addLayer({
    id: 'sentinel-layer',
    type: 'raster',
    source: 'sentinel',
    minzoom: 0,
    maxzoom: 20
});
```

### Copernicus Data Space Ecosystem経由

こちらは植生指標などのデータ検出用にすでに加工してくれていたりするので、NDVIをすぐに利用するようなこともできます。

```javascript
map.addSource('sentinel-copernicus', {
    type: 'raster',
    tiles: [
        'https://sh.dataspace.copernicus.eu/ogc/wms/{INSTANCE_ID}?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=TRUE_COLOR&time=2024-01-01/2024-12-31'
    ],
    tileSize: 256,
    attribution: 'Contains modified Copernicus Sentinel data'
});
```



他にはAWS Earth Searchなども提供されていて、これは`COG（Cloud Optimized GeoTIFF）形式`なのでかなり今時だと思います。