const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// デバッグ用ミドルウェア
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ミドルウェアの設定
app.use(helmet({
  contentSecurityPolicy: false, // 一時的に無効化
  crossOriginEmbedderPolicy: false,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの配信を最初に設定
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ルーターのインポート（エラーハンドリング付き）
try {
  const authRoutes = require('./routes/auth');
  const postsRoutes = require('./routes/posts');
  const usersRoutes = require('./routes/users');
  
  // APIルートの設定
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/users', usersRoutes);
} catch (error) {
  console.error('Failed to load routes:', error);
}

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404ハンドラー
app.use((req, res) => {
  console.log('404 Not Found:', req.path);
  res.status(404).send('Not Found');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Public directory: ${path.join(__dirname, '../public')}`);
});