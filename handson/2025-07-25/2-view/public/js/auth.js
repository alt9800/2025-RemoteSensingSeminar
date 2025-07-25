// 認証関連の関数

// ログインチェックと認証が必要なページでのリダイレクト
function requireAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login/';
        return false;
    }
    return true;
}

// トークンの検証
async function verifyToken() {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.valid;
        }
        
        // トークンが無効な場合はクリア
        removeAuthToken();
        return false;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// ログイン処理
async function login(userId, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setAuthToken(data.token);
            setUserInfo(data.user);
            return { success: true };
        } else {
            return { success: false, error: data.message || 'ログインに失敗しました' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'ネットワークエラーが発生しました' };
    }
}

// サインアップ処理
async function signup(email, userId, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                user_id: userId,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setAuthToken(data.token);
            setUserInfo(data.user);
            return { success: true };
        } else {
            // バリデーションエラーの処理
            if (data.errors) {
                const errorMessages = data.errors.map(err => err.msg).join('\n');
                return { success: false, error: errorMessages };
            }
            return { success: false, error: data.message || 'サインアップに失敗しました' };
        }
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: 'ネットワークエラーが発生しました' };
    }
}

// ユーザー情報の取得
async function fetchUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            setUserInfo(data.user);
            return data.user;
        }
        
        return null;
    } catch (error) {
        console.error('Fetch user info error:', error);
        return null;
    }
}