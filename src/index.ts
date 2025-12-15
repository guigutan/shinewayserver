import express, { Request, Response } from 'express';
import mariadb from 'mariadb';
import cors from 'cors';

const app = express();
app.set('case sensitive routing', false);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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



//get接口示例(http://localhost:3000/api/GetMachine1F/C1)
app.get('/api/GetMachine1F/:MachineNO', async (req, res) => {
  // GET 路由参数从 req.params 获取
  const { MachineNO } = req.params as { MachineNO?: string };  
  // 参数校验：避免空值查询
  if (!MachineNO) {
    return res.status(400).json({ error: '参数错误', message: 'MachineNO 不能为空' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    // 参数化查询（防SQL注入），这里直接用 MachineNO 即可，无需 `${}` 包裹
    const rows = await conn.query(
      'SELECT * FROM t_machine where MachineNO=? LIMIT 20',
      [MachineNO]
    );
    res.json({ code: 200, data: rows });
  } catch (err: any) {
    console.error('查询失败：', err); // 打印错误日志便于排查
    res.status(500).json({ error: 'Query failed', message: err.message });
  } finally {
    if (conn) conn.release(); // 释放连接
  }
});



//get接口示例(http://localhost:3000/api/GetLed1F/202512141443)
app.get('/api/GetLed1F/:ScadaNO', async (req, res) => {
  // GET 路由参数从 req.params 获取
  const { ScadaNO } = req.params as { ScadaNO?: string };  
  
  // 修正：提示文字改为 ScadaNO 不能为空
  if (!ScadaNO) {
    return res.status(400).json({ 
      success: false, 
      message: 'ScadaNO 不能为空' 
    });
  }
  let conn;

  try {
    conn = await pool.getConnection();
    // 参数化查询（防SQL注入），这里直接用 MachineNO 即可，无需 `${}` 包裹
    const rows = await conn.query(
      `SELECT t_machine.MachineNO,t_scadadata.LedStatus FROM t_machine LEFT JOIN   t_scadadata ON t_scadadata.MachineID=t_machine.MachineID
        WHERE t_machine.MachineStatus=1
        AND t_scadadata.ScadaNO=?
        ORDER BY t_machine.OrderBy `,
      [ScadaNO]
    );
    // 修正：返回 success 字段，和前端一致
    res.json({ 
      success: true, 
      data: rows 
    });


  } catch (err: any) {
    
   console.error('查询失败：', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || '查询失败' 
    });


  } finally {
    if (conn) conn.release(); // 释放连接
  }
});




//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

app.post('/api/GetSum1FTest', async (req, res) => {
  const { MachineNO } = req.body as { MachineNO?: string }; 

  try {
    
    const [rows] = await pool.query(
      'SELECT * FROM t_machine WHERE MachineNO = ?',
      [`${MachineNO || ''}`]
    );

    res.json({ success: true, data: rows });
     

  } catch (err: any) {
    console.error('查询错误:', err);
    res.status(500).json({ success: false, message: err.message || '查询失败' });
  }
});




// POST 接口示例：http://localhost:3000/api/GetSum1F
// 请求体（JSON）：
// {
//   "DayT1": "202512140000",
//   "DayT2": "202512150000",
//   "LastT1": "202512140800",
//   "LastT2": "202512142000",
//   "ThisT1": "202512142000",
//   "ThisT2": "202512150800"
// }
app.post('/api/GetSum1F', async (req, res) => {
  // 1. 从请求体（req.body）中获取参数
  const { DayT1, DayT2, LastT1, LastT2, ThisT1, ThisT2 } = req.body as {
    DayT1?: string;
    DayT2?: string;
    LastT1?: string;
    LastT2?: string;
    ThisT1?: string;
    ThisT2?: string;
  };

  let conn;
  try {

    conn = await pool.getConnection();
   
    const sql = `
      SELECT   
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS DaySum,  
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS LastSum,   
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS ThisSum 
      FROM t_scadadata
      WHERE WkcntrCount > 0; 
    `;

    const params = [DayT1, DayT2, LastT1, LastT2, ThisT1, ThisT2];

    // 执行查询（兼容 mysql2/promise 的返回值：[rows, fields]）
    const rows = await conn.query(sql, params);

    // 4. 返回结果
     res.json({ 
      success: true, 
      data: rows 
    });
    

  } catch (err: any) {
    
    console.error('查询失败：', err);   
    const errorMsg = process.env.NODE_ENV === 'production'
      ? '服务器内部错误，请稍后重试'
      : err.message || '查询失败';

    res.status(500).json({
      success: false,
      message: errorMsg
    });

  } finally {
    if (conn) conn.release(); // 释放数据库连接
  }
});














//-------------------------------------------------------------
const port=3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



