const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Multerの設定
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || 'jpg,jpeg,png,gif').split(',');
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('許可されていないファイル形式です'));
    }
  }
});

// 投稿一覧の取得（認証不要）
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        p.id,
        p.latitude,
        p.longitude,
        p.comment,
        p.image_path,
        p.created_at,
        p.user_id,
        u.user_id as username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await db.query(query, [limit, offset]);
    
    // 画像パスを完全なURLに変換
    const posts = result.rows.map(post => ({
      ...post,
      image_url: post.image_path ? `/uploads/${path.basename(post.image_path)}` : null,
      is_owner: req.user ? post.user_id === req.user.id : false
    }));
    
    res.json({
      posts,
      total: posts.length
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定の投稿の取得
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.id,
        p.latitude,
        p.longitude,
        p.comment,
        p.image_path,
        p.created_at,
        p.user_id,
        u.user_id as username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '投稿が見つかりません' });
    }
    
    const post = result.rows[0];
    res.json({
      ...post,
      image_url: post.image_path ? `/uploads/${path.basename(post.image_path)}` : null,
      is_owner: req.user ? post.user_id === req.user.id : false
    });
    
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 新規投稿の作成（認証必要）
router.post('/', authenticateToken, upload.single('image'), [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('comment').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // アップロードされたファイルを削除
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { latitude, longitude, comment } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    
    const query = `
      INSERT INTO posts (user_id, latitude, longitude, comment, image_path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, latitude, longitude, comment, image_path, created_at
    `;
    
    const result = await db.query(query, [
      req.user.id,
      latitude,
      longitude,
      comment || '',
      imagePath
    ]);
    
    const post = result.rows[0];
    res.status(201).json({
      message: '投稿が作成されました',
      post: {
        ...post,
        image_url: imagePath ? `/uploads/${imagePath}` : null,
        username: req.user.user_id,
        is_owner: true
      }
    });
    
  } catch (error) {
    console.error('Create post error:', error);
    // エラー時はアップロードされたファイルを削除
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 投稿の更新（コメントのみ）
router.put('/:id', authenticateToken, [
  body('comment').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { comment } = req.body;
    
    // 所有者確認
    const checkQuery = 'SELECT user_id FROM posts WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: '投稿が見つかりません' });
    }
    
    if (checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'この投稿を編集する権限がありません' });
    }
    
    // 更新実行
    const updateQuery = `
      UPDATE posts 
      SET comment = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, latitude, longitude, comment, image_path, created_at, updated_at
    `;
    
    const result = await db.query(updateQuery, [comment, id]);
    const post = result.rows[0];
    
    res.json({
      message: '投稿が更新されました',
      post: {
        ...post,
        image_url: post.image_path ? `/uploads/${post.image_path}` : null,
        is_owner: true
      }
    });
    
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 投稿の削除
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 所有者確認と画像パスの取得
    const checkQuery = 'SELECT user_id, image_path FROM posts WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: '投稿が見つかりません' });
    }
    
    if (checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'この投稿を削除する権限がありません' });
    }
    
    const imagePath = checkResult.rows[0].image_path;
    
    // 削除実行
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    
    // 画像ファイルの削除
    if (imagePath) {
      const fullPath = path.join(__dirname, '../../uploads', imagePath);
      await fs.unlink(fullPath).catch(console.error);
    }
    
    res.json({ message: '投稿が削除されました' });
    
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの投稿一覧
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        p.id,
        p.latitude,
        p.longitude,
        p.comment,
        p.image_path,
        p.created_at,
        p.user_id,
        u.user_id as username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE u.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [userId, limit, offset]);
    
    const posts = result.rows.map(post => ({
      ...post,
      image_url: post.image_path ? `/uploads/${path.basename(post.image_path)}` : null,
      is_owner: req.user ? post.user_id === req.user.id : false
    }));
    
    res.json({
      posts,
      total: posts.length
    });
    
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;