import { Router, Response } from 'express';
import { pool1F } from '../config/db';
import { SumRequest, ApiResponse } from '../types';

const router = Router();

// POST /api/MachineHoursSum1F
router.post('/MachineHoursSum1F', async (req: SumRequest, res: Response) => {
  const { MachineNO, ScadaNOT1, ScadaNOT2 } = req.body;
  let conn;

  try {
    conn = await pool1F.getConnection();
    const sql = `
      SELECT  LEFT(ScadaNO,10) AS ScadaNO,SUM(WkcntrCount) AS WkcntrCount  FROM t_scadadata 
        WHERE MachineID=(SELECT MachineID FROM t_machine WHERE MachineNO=?) 
        AND ScadaNO>=? AND ScadaNO<?
        GROUP BY LEFT(ScadaNO,10)
        ORDER BY LEFT(ScadaNO,10) ; 
            `;
    const params = [MachineNO, ScadaNOT1, ScadaNOT2];
    const rows = await conn.query(sql, params);

    const successRes: ApiResponse = {
      success: true,
      data: rows
    };
    res.json(successRes);
  } catch (err: any) {
    console.error('1楼统计查询失败：', err);
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