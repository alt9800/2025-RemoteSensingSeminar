// 地図関連の機能（Phase 3で完全実装）

let map;
let posts = [];

// 地図の初期化（暫定）
function initMap() {
    // Phase 3で実装
    console.log('Map will be initialized in Phase 3');
    
    // とりあえず投稿一覧だけ読み込む
    loadPosts();
}

// 投稿の読み込み
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const data = await response.json();
        
        if (response.ok) {
            posts = data.posts;
            displayPosts(data.posts);
        }
    } catch (error) {
        console.error('Load posts error:', error);
        showError('投稿の読み込みに失敗しました');
    }
}

// 投稿一覧の表示
function displayPosts(posts) {
    const postsList = document.getElementById('posts-list');
    
    if (!postsList) return;
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p class="loading">投稿がありません</p>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item" data-post-id="${post.id}">
            <div class="post-header">
                <span class="post-user">${escapeHtml(post.username)}</span>
                <span class="post-date">${formatDate(post.created_at)}</span>
            </div>
            ${post.comment ? `<p class="post-comment">${escapeHtml(post.comment)}</p>` : ''}
            ${post.image_url ? `<img src="${post.image_url}" alt="投稿画像" class="post-image">` : ''}
        </div>
    `).join('');
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
    }
});