import { Router, Response } from 'express';
import { pool1F } from '../config/db';
import { MachineNORequest, ApiResponse } from '../types';

const router = Router();

// GET /api/GetNewScada1F/:MachineNO
router.get('/GetNewScada1F/:MachineNO', async (req: MachineNORequest, res: Response) => {
  const { MachineNO } = req.params;
  let conn;

  try {
    if (!MachineNO) {
      const errorRes: ApiResponse = {
        code: 400,
        success: false,
        message: 'MachineNO 不能为空'
      };
      return res.status(400).json(errorRes);
    }

    conn = await pool1F.getConnection();
    const rows = await conn.query(
      `SELECT  DATE_FORMAT(CreateTime, '%Y-%m-%d %H:%i:%s') AS CreateTime,
        LedStatus,WkcntrNum FROM t_scadadata 
        WHERE MachineID=(SELECT MachineID FROM t_machine WHERE MachineNO=?) 
        ORDER BY ScadaID desc LIMIT 1`,
      [MachineNO]
    );

    const successRes: ApiResponse = {
      code: 200,
      success: true,
      data: rows
    };
    res.json(successRes);
  } catch (err: any) {
    console.error('1楼机器查询失败：', err);
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