// マイページ機能

// 認証チェック
if (!requireAuth()) {
    // requireAuth内でリダイレクトされる
}

// ユーザー情報の読み込み
async function loadUserInfo() {
    try {
        const [userResponse, statsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE_URL}/users/me/stats`, { headers: getAuthHeaders() })
        ]);

        if (userResponse.ok && statsResponse.ok) {
            const userData = await userResponse.json();
            const statsData = await statsResponse.json();
            
            displayUserInfo(userData.user, statsData.stats);
        }
    } catch (error) {
        console.error('Load user info error:', error);
        showError('ユーザー情報の読み込みに失敗しました');
    }
}

// ユーザー情報の表示
function displayUserInfo(user, stats) {
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = `
        <p><strong>ユーザーID:</strong> ${user.user_id}</p>
        <p><strong>メールアドレス:</strong> ${user.email}</p>
        <p><strong>登録日:</strong> ${new Date(user.created_at).toLocaleDateString('ja-JP')}</p>
        
        <div class="user-stats">
            <div class="stat-card">
                <div class="stat-value">${stats.total_posts}</div>
                <div class="stat-label">総投稿数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.posts_with_images}</div>
                <div class="stat-label">画像付き投稿</div>
            </div>
        </div>
    `;
}

// 自分の投稿の読み込み
async function loadMyPosts() {
    try {
        const user = getUserInfo();
        const response = await fetch(`${API_BASE_URL}/posts/user/${user.user_id}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            displayMyPosts(data.posts);
        }
    } catch (error) {
        console.error('Load my posts error:', error);
        showError('投稿の読み込みに失敗しました');
    }
}

// 投稿の表示
function displayMyPosts(posts) {
    const postsGrid = document.getElementById('my-posts-grid');
    
    if (posts.length === 0) {
        postsGrid.innerHTML = '<p>まだ投稿がありません</p>';
        return;
    }

    postsGrid.innerHTML = posts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            ${post.image_url ? 
                `<img src="${post.image_url}" alt="投稿画像" class="post-image">` : 
                '<div class="post-image" style="display: flex; align-items: center; justify-content: center; color: #9ca3af;">画像なし</div>'
            }
            <div class="post-content">
                <p class="post-date">${formatDate(post.created_at)}</p>
                <p class="post-comment">${escapeHtml(post.comment || '（コメントなし）')}</p>
                <p style="font-size: 0.875rem; color: #6b7280;">
                    緯度: ${post.latitude.toFixed(6)}, 経度: ${post.longitude.toFixed(6)}
                </p>
                <div class="post-actions">
                    <button class="btn btn-outline btn-small" onclick="viewOnMap(${post.latitude}, ${post.longitude})">
                        地図で見る
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deletePost(${post.id})">
                        削除
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 地図で表示（メインページに遷移）
function viewOnMap(lat, lng) {
    // 位置情報をセッションストレージに保存
    sessionStorage.setItem('focusLocation', JSON.stringify({ lat, lng }));
    window.location.href = '/';
}

// 投稿の削除
async function deletePost(postId) {
    if (!confirm('この投稿を削除しますか？')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            showSuccess('投稿を削除しました');
            loadMyPosts(); // 再読み込み
        } else {
            const data = await response.json();
            showError(data.message || '削除に失敗しました');
        }
    } catch (error) {
        console.error('Delete post error:', error);
        showError('ネットワークエラーが発生しました');
    }
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    loadUserInfo();
    loadMyPosts();
});