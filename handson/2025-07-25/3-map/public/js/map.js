// 地図関連の機能

let map;
let markers = [];
let selectedLocation = null;
let selectedPostId = null;
let isMarkerClick = false;

// 地図スタイルの定義
const mapStyles = {
    'osm-bright': {
        name: 'OpenStreetMap',
        style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json'
    },
    'osm-standard': {
        name: 'OSM Standard',
        style: {
            version: 8,
            sources: {
                'osm-tiles': {
                    type: 'raster',
                    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors'
                }
            },
            layers: [{
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19
            }]
        }
    },
    'esri-satellite': {
        name: 'ESRI 衛星写真',
        style: {
            version: 8,
            sources: {
                'esri-satellite': {
                    type: 'raster',
                    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                    tileSize: 256,
                    attribution: '© Esri'
                }
            },
            layers: [{
                id: 'esri-satellite',
                type: 'raster',
                source: 'esri-satellite',
                minzoom: 0,
                maxzoom: 19
            }]
        }
    }
};

let currentStyle = 'osm-bright';

// 地図の初期化
function initMap() {
    // MapLibre GL JSの初期化（宇部市を中心に）
    map = new maplibregl.Map({
        container: 'map',
        style: mapStyles[currentStyle].style,
        center: [131.2463, 33.9980], // 宇部市の座標
        zoom: 12
    });

    // ナビゲーションコントロール追加
    map.addControl(new maplibregl.NavigationControl());

    // 現在地コントロール追加
    map.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );

    // スタイル切り替えコントロールの追加
    createStyleControl();

    // 地図クリックイベント
    map.on('click', (e) => {
        // マーカークリックの場合はスキップ
        if (isMarkerClick) {
            isMarkerClick = false;
            return;
        }

        const user = getUserInfo();
        if (!user) {
            if (confirm('投稿するにはログインが必要です。ログインページに移動しますか？')) {
                window.location.href = '/login/';
            }
            return;
        }

        selectedLocation = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
        };
        
        showPostModal(selectedLocation);
    });

    // 地図読み込み完了後
    map.on('load', () => {
        loadPosts();
        
        // マイページからの遷移チェック
        const focusLocation = sessionStorage.getItem('focusLocation');
        if (focusLocation) {
            const location = JSON.parse(focusLocation);
            setTimeout(() => {
                focusOnPost(location.lat, location.lng);
            }, 1000);
            sessionStorage.removeItem('focusLocation');
        }
    });
}

// スタイル切り替えコントロールの作成
function createStyleControl() {
    const control = document.createElement('div');
    control.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    control.style.marginTop = '10px';
    
    const select = document.createElement('select');
    select.style.padding = '5px';
    select.style.fontSize = '12px';
    select.style.cursor = 'pointer';
    
    Object.entries(mapStyles).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.name;
        if (key === currentStyle) option.selected = true;
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
        switchMapStyle(e.target.value);
    });
    
    control.appendChild(select);
    map.addControl({
        onAdd: () => control,
        onRemove: () => {}
    }, 'top-right');
}

// 地図スタイルの切り替え
function switchMapStyle(styleKey) {
    if (!mapStyles[styleKey]) return;
    
    currentStyle = styleKey;
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    // 既存のマーカーを一時保存
    const tempMarkers = markers.map(marker => ({
        lngLat: marker.getLngLat(),
        popup: marker.getPopup()
    }));
    
    // スタイルを変更
    map.setStyle(mapStyles[styleKey].style);
    
    // スタイル読み込み完了後にマーカーを復元
    map.once('style.load', () => {
        // 位置とズームを復元
        map.jumpTo({ center, zoom });
        
        // マーカーをクリア
        markers.forEach(marker => marker.remove());
        markers = [];
        
        // 投稿を再読み込み
        loadPosts();
    });
}

// 投稿の読み込みと表示
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const data = await response.json();
        
        if (response.ok) {
            displayPosts(data.posts);
            addMarkersToMap(data.posts);
        }
    } catch (error) {
        console.error('Load posts error:', error);
        showError('投稿の読み込みに失敗しました');
    }
}

// 投稿一覧の表示
function displayPosts(posts) {
    const postsList = document.getElementById('posts-list');
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p class="loading">投稿がありません</p>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item ${selectedPostId === post.id ? 'selected' : ''}" 
             data-post-id="${post.id}" 
             onclick="selectPost(${post.id}, ${post.latitude}, ${post.longitude})">
            <div class="post-header">
                <span class="post-user">${escapeHtml(post.username)}</span>
                <span class="post-date">${formatDate(post.created_at)}</span>
            </div>
            ${post.comment ? `<p class="post-comment">${escapeHtml(post.comment)}</p>` : ''}
            ${post.image_url ? `<img src="${post.image_url}" alt="投稿画像" class="post-image">` : ''}
        </div>
    `).join('');
}

// 投稿を選択
function selectPost(postId, lat, lng) {
    selectedPostId = postId;
    
    // 選択状態のスタイルを更新
    document.querySelectorAll('.post-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`[data-post-id="${postId}"]`)?.classList.add('selected');
    
    // 地図を移動
    focusOnPost(lat, lng);
    
    // 対応するマーカーのポップアップを表示
    const marker = markers.find(m => m.postId === postId);
    if (marker && marker.getPopup()) {
        marker.getPopup().addTo(map);
    }
}

// 地図にマーカーを追加
function addMarkersToMap(posts) {
    // 既存のマーカーをクリア
    markers.forEach(marker => marker.remove());
    markers = [];
    
    posts.forEach(post => {
        // カスタムマーカー要素
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = post.is_owner ? '#2563eb' : '#ef4444';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        
        // サムネイル付きポップアップの内容
        const popupContent = `
            <div class="popup-content">
                ${post.image_url ? `<img src="${post.image_url}" alt="投稿画像" class="popup-image">` : ''}
                <div class="popup-user">${escapeHtml(post.username)}</div>
                <div class="popup-date">${formatDate(post.created_at)}</div>
                ${post.comment ? `<p class="popup-comment">${escapeHtml(post.comment)}</p>` : ''}
            </div>
        `;
        
        // マーカーの作成
        const marker = new maplibregl.Marker(el)
            .setLngLat([post.longitude, post.latitude])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
            .addTo(map);
        
        // マーカーに投稿IDを追加
        marker.postId = post.id;
        
        // マーカークリックイベント
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            isMarkerClick = true;
            selectPost(post.id, post.latitude, post.longitude);
        });
        
        markers.push(marker);
    });
}

// 特定の投稿にフォーカス
function focusOnPost(lat, lng) {
    map.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 1000
    });
}

// 投稿モーダルの表示
function showPostModal(location) {
    const modal = document.getElementById('post-modal');
    const latSpan = document.getElementById('modal-lat');
    const lngSpan = document.getElementById('modal-lng');
    
    latSpan.textContent = location.lat.toFixed(6);
    lngSpan.textContent = location.lng.toFixed(6);
    
    modal.style.display = 'flex';
    
    // 一時的なマーカーを追加
    const tempMarker = new maplibregl.Marker({ color: '#10b981' })
        .setLngLat([location.lng, location.lat])
        .addTo(map);
    
    // モーダルを閉じたときにマーカーを削除
    modal.dataset.tempMarker = markers.length;
    markers.push(tempMarker);
}

// 投稿モーダルを閉じる
function closePostModal() {
    const modal = document.getElementById('post-modal');
    modal.style.display = 'none';
    
    // フォームをリセット
    document.getElementById('post-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    // 一時的なマーカーを削除
    if (modal.dataset.tempMarker) {
        const markerIndex = parseInt(modal.dataset.tempMarker);
        if (markers[markerIndex]) {
            markers[markerIndex].remove();
            markers.splice(markerIndex, 1);
        }
        delete modal.dataset.tempMarker;
    }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
    // 地図の初期化
    if (document.getElementById('map')) {
        initMap();
    }
    
    // モーダル関連のイベント
    const modal = document.getElementById('post-modal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancel-post');
    const postForm = document.getElementById('post-form');
    const imageInput = document.getElementById('post-image');
    
    if (!modal || !closeBtn || !cancelBtn || !postForm || !imageInput) {
        return; // 要素がない場合は処理しない
    }
    
    // モーダルを閉じる
    closeBtn.addEventListener('click', closePostModal);
    cancelBtn.addEventListener('click', closePostModal);
    
    // モーダル外側クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePostModal();
        }
    });
    
    // 画像プレビュー
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('image-preview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="プレビュー">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });
    
    // フォーム送信
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('latitude', selectedLocation.lat);
        formData.append('longitude', selectedLocation.lng);
        formData.append('comment', document.getElementById('post-comment').value);
        
        const imageFile = document.getElementById('post-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showSuccess('投稿が完了しました');
                closePostModal();
                loadPosts(); // 投稿一覧を再読み込み
            } else {
                showError(data.message || '投稿に失敗しました');
            }
        } catch (error) {
            console.error('Post error:', error);
            showError('ネットワークエラーが発生しました');
        }
    });
});