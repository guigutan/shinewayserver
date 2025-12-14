import express from 'express';
import { pool } from '../config/db';

const router = express.Router();

// 1. 获取所有用户
router.get('/', async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM users');
    conn.release();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 2. 根据 ID 获取用户
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const user = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    conn.release();
    if (user.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user[0]);
  } catch (err) {
    next(err);
  }
});

// 3. 创建用户
router.post('/', async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: '姓名和邮箱为必填项' });
    }
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    conn.release();
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      age
    });
  } catch (err) {
    next(err);
  }
});

// 4. 更新用户
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const conn = await pool.getConnection();
    // 检查用户是否存在
    const user = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      conn.release();
      return res.status(404).json({ message: '用户不存在' });
    }
    // 更新用户
    await conn.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age, id]
    );
    conn.release();
    res.json({ message: '用户更新成功' });
  } catch (err) {
    next(err);
  }
});

// 5. 删除用户
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    // 检查用户是否存在
    const user = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      conn.release();
      return res.status(404).json({ message: '用户不存在' });
    }
    // 删除用户
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
    conn.release();
    res.json({ message: '用户删除成功' });
  } catch (err) {
    next(err);
  }
});

export default router;