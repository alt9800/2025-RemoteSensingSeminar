const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 現在のユーザー情報を取得
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.user_id,
        u.email,
        u.created_at,
        COUNT(p.id) as post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.user_id, u.email, u.created_at
    `;
    
    const result = await db.query(query, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        post_count: parseInt(user.post_count)
      }
    });
    
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザー情報の更新（メールアドレスのみ）
router.put('/me', authenticateToken, [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;
    
    // 重複チェック
    const checkQuery = 'SELECT id FROM users WHERE email = $1 AND id != $2';
    const checkResult = await db.query(checkQuery, [email, req.user.id]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }
    
    // 更新実行
    const updateQuery = `
      UPDATE users 
      SET email = $1
      WHERE id = $2
      RETURNING id, user_id, email, created_at
    `;
    
    const result = await db.query(updateQuery, [email, req.user.id]);
    const user = result.rows[0];
    
    res.json({
      message: 'ユーザー情報が更新されました',
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// パスワードの変更
router.put('/me/password', authenticateToken, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }).withMessage('パスワードは6文字以上必要です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { current_password, new_password } = req.body;
    
    // 現在のパスワードを確認
    const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    const isValid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ message: '現在のパスワードが正しくありません' });
    }
    
    // 新しいパスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    // 更新実行
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );
    
    res.json({ message: 'パスワードが変更されました' });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの統計情報
router.get('/me/stats', authenticateToken, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_posts,
        COUNT(image_path) as posts_with_images,
        MIN(created_at) as first_post_date,
        MAX(created_at) as last_post_date
      FROM posts
      WHERE user_id = $1
    `;
    
    const result = await db.query(statsQuery, [req.user.id]);
    const stats = result.rows[0];
    
    res.json({
      stats: {
        total_posts: parseInt(stats.total_posts),
        posts_with_images: parseInt(stats.posts_with_images),
        first_post_date: stats.first_post_date,
        last_post_date: stats.last_post_date
      }
    });
    
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 公開ユーザー情報の取得（他のユーザーの情報）
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        u.user_id,
        u.created_at,
        COUNT(p.id) as post_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      WHERE u.user_id = $1
      GROUP BY u.id, u.user_id, u.created_at
    `;
    
    const result = await db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    const user = result.rows[0];
    res.json({
      user: {
        user_id: user.user_id,
        created_at: user.created_at,
        post_count: parseInt(user.post_count)
      }
    });
    
  } catch (error) {
    console.error('Get public user info error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;