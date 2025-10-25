## npmで実行環境をインストールする

どこがサーバーで、どこがフロントエンドか気をつけながら設定しましょう。

事前準備
```sh
# 依存関係のインストール
npm install
(cp .env.example .env)

# データベースの初期化
node scripts/init-db.js

```

実行
```sh
npm run dev
# 本番環境では以下のコマンドを使う様にする
npm start
```


---

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

npm版(ベアメタル)ディレクトリ構成

```sh
project/
├── package.json
├── .env                    # 環境変数（.env.exampleからコピー）
├── .env.example
├── scripts/
│   └── init-db.js         # データベース初期化スクリプト
├── src/
│   ├── server.js          # メインサーバーファイル
│   ├── config/
│   │   └── db.js          # SQLite接続設定
│   ├── middleware/
│   │   └── auth.js        # JWT認証ミドルウェア
│   └── routes/
│       ├── auth.js        # 認証関連API
│       ├── posts.js       # 投稿関連API
│       └── users.js       # ユーザー関連API
├── public/                # 静的ファイル（フロントエンド）
├── uploads/               # アップロードされた画像
└── db/
    └── database.db        # SQLiteデータベースファイル
```