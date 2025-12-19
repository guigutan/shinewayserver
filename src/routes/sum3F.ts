import { Router, Response } from 'express';
import { pool3F } from '../config/db';
import { SumRequest, ApiResponse } from '../types';

const router = Router();

// POST /api/GetSum3F
router.post('/GetSum3F', async (req: SumRequest, res: Response) => {
  const { DayT1, DayT2, LastT1, LastT2, ThisT1, ThisT2 } = req.body;
  let conn;

  try {
    conn = await pool3F.getConnection();
    const sql = `
      SELECT   
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS DaySum,  
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS LastSum,   
        SUM(CASE WHEN ScadaNO >= ? AND ScadaNO < ? THEN WkcntrCount ELSE 0 END) AS ThisSum 
      FROM t_scadadata
      WHERE WkcntrCount > 0; 
    `;
    const params = [DayT1, DayT2, LastT1, LastT2, ThisT1, ThisT2];
    const rows = await conn.query(sql, params);

    const successRes: ApiResponse = {
      success: true,
      data: rows
    };
    res.json(successRes);
  } catch (err: any) {
    console.error('3楼统计查询失败：', err);
    const errorRes: ApiResponse = {
      success: false,
      message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
    };
    res.status(500).json(errorRes);
  } finally {
    if (conn) conn.release();
  }
});

export default router;