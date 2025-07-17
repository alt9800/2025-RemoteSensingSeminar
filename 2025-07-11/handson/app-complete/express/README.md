## Dockerで動かしたい場合

Dockerのクライアントを導入する

https://www.docker.com/get-started/

Docker hubへのログインは必須ではないほか、Docker Desktop以外のクライアントでもよい。
Limaがお勧めです。PodmanやOrbstack、AppleのDevContainerなどもあります。
Amazonの Finch なども。

(WSL Ubuntuなどで動かすのであればこれでコマンドラインから導入してもOK!)
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```


## ディレクトリ構造


```
field-survey-app/
├── docker-compose.yml
├── Dockerfile
├── init.sql
├── package.json
├── .env                    # .env.exampleからコピー
├── .env.example
├── src/
│   ├── server.js           # メインサーバーファイル
│   ├── config/
│   │   └── db.js          # データベース接続設定
│   ├── middleware/
│   │   └── auth.js        # JWT認証ミドルウェア
│   └── routes/
│       ├── auth.js        # 認証関連API (/api/auth/*)
│       ├── posts.js       # 投稿関連API (/api/posts/*)
│       └── users.js       # ユーザー関連API (/api/users/*)
├── public/                 # 静的ファイル（フロントエンド）
│   ├── index.html         # メインページ（地図表示）
│   ├── css/
│   │   └── style.css      # 共通スタイル
│   ├── js/
│   │   ├── map.js         # 地図機能（MapLibre GL JS）
│   │   ├── auth.js        # 認証関連のJS（ログイン・ログアウト処理）
│   │   └── common.js      # 共通機能（ヘッダー制御など）
│   ├── signup/
│   │   └── index.html     # サインアップページ
│   ├── login/
│   │   └── index.html     # ログインページ
│   └── mypage/
│       └── index.html     # マイページ（自分の投稿一覧）
└── uploads/               # アップロードされた画像の保存先
    └── .gitkeep
```

APIエンドポイント

投稿関連 (posts.js)

GET /api/posts - 投稿一覧の取得（認証不要）
GET /api/posts/:id - 特定の投稿の取得
POST /api/posts - 新規投稿の作成（要認証、画像アップロード対応）
PUT /api/posts/:id - 投稿の更新（コメントのみ）
DELETE /api/posts/:id - 投稿の削除
GET /api/posts/user/:userId - 特定ユーザーの投稿一覧

ユーザー関連 (users.js)

GET /api/users/me - 現在のユーザー情報
PUT /api/users/me - メールアドレスの更新
PUT /api/users/me/password - パスワードの変更
GET /api/users/me/stats - ユーザーの統計情報
GET /api/users/:userId - 公開ユーザー情報（他のユーザー）


---

ユーザ登録

```sh
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "user_id": "testuser"
  }'
```

レスポンス
```
{"message":"ユーザー登録が完了しました","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9pZCI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUyMTkzNDI4LCJleHAiOjE3NTI3OTgyMjh9.rzFw4P6q8pffiYmpRjh0zjYsFjvyTSPk9z1TSKnkdic","user":{"id":1,"email":"test@example.com","user_id":"testuser"}
```

---

ログイン
```sh
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "testuser",
    "password": "password123"
  }'
```



---


こんな感じでも動く

```sh
project/
├── server.js              # Expressサーバー
├── package.json
├── public/               # 静的ファイル
│   ├── index.html       # メインページ（地図表示）
│   ├── signup/
│   │   └── index.html   # サインアップページ
│   ├── login/
│   │   └── index.html   # ログインページ
│   ├── mypage/
│   │   └── index.html   # マイページ
│   ├── css/
│   │   └── style.css    # 共通スタイル
│   └── js/
│       ├── map.js       # 地図機能
│       ├── auth.js      # 認証関連
│       └── common.js    # 共通機能
├── uploads/             # アップロード画像保存先
├── db/
│   └── database.db      # SQLiteデータベース
└── routes/              # APIルート
    ├── auth.js          # 認証API
    ├── posts.js         # 投稿API
    └── users.js         # ユーザーAPI
```