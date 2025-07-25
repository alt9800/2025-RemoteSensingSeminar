const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 現在のユーザー情報を取得（認証必要）
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, user_id, email, created_at
      FROM users
      WHERE id = ?
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
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;