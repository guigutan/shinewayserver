import express from 'express';
import mariadb from 'mariadb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ===== 直接在这里填写你的 MariaDB 配置 =====
const pool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root', 
  password: 'Aa111111', 
  database: 'db_ScadaBrother',
  connectionLimit: 10 // 连接池大小，可根据需要调整
});
// ============================================



// 接口
app.post('/api/Machine', async (req, res) => {
  const { MachineNO } = req.body as { MachineNO?: string };  // 断言解决 any

  try {
    const [rows] = await pool.query(
      'SELECT * from t_machine WHERE MachineNO LIKE ? LIMIT 100',
      [`%${MachineNO || ''}%`]
    );
    res.json({ success: true, data: rows });
  } catch (err: any) {
    console.error('查询错误:', err);
    res.status(500).json({ success: false, message: err.message || '查询失败' });
  }
});

//-------------------------------------------------------------
const port=3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});