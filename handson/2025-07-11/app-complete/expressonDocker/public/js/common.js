// 共通関数とユーティリティ

// API のベースURL
const API_BASE_URL = '/api';

// ローカルストレージのキー
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

// 認証トークンの取得
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// 認証トークンの保存
function setAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// 認証トークンの削除
function removeAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// ユーザー情報の取得
function getUserInfo() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// ユーザー情報の保存
function setUserInfo(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// APIリクエストのヘッダー生成
function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// 日付フォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 1分以内
    if (diff < 60000) {
        return 'たった今';
    }
    // 1時間以内
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分前`;
    }
    // 24時間以内
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}時間前`;
    }
    // 7日以内
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}日前`;
    }
    
    // それ以外は日付表示
    return date.toLocaleDateString('ja-JP');
}

// エラーメッセージの表示
function showError(message, targetElement) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    if (targetElement) {
        // 既存のエラーメッセージを削除
        const existingError = targetElement.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        targetElement.appendChild(errorDiv);
        
        // 5秒後に自動削除
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    } else {
        alert(message);
    }
}

// 成功メッセージの表示
function showSuccess(message, targetElement) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    if (targetElement) {
        // 既存のメッセージを削除
        const existingMessage = targetElement.querySelector('.success, .error');
        if (existingMessage) {
            existingMessage.remove();
        }
        targetElement.appendChild(successDiv);
        
        // 3秒後に自動削除
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    } else {
        alert(message);
    }
}

// ヘッダーナビゲーションの更新
function updateNavigation() {
    const notLoggedIn = document.getElementById('nav-not-logged-in');
    const loggedIn = document.getElementById('nav-logged-in');
    const usernameSpan = document.getElementById('current-username');
    
    // 要素が存在しない場合は早期リターン
    if (!notLoggedIn || !loggedIn) {
        console.warn('Navigation elements not found');
        return;
    }
    
    const user = getUserInfo();
    
    if (user) {
        // ログイン済み
        notLoggedIn.style.display = 'none';
        loggedIn.style.display = 'flex';
        if (usernameSpan) {
            usernameSpan.textContent = user.user_id;
        }
    } else {
        // 未ログイン
        notLoggedIn.style.display = 'flex';
        loggedIn.style.display = 'none';
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // ログアウトボタンのイベント
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('ログアウトしますか？')) {
                removeAuthToken();
                window.location.href = '/';
            }
        });
    }
});