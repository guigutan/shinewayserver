import { Router, Response } from 'express';
import { pool3F } from '../config/db';
import { MachineNORequest, ApiResponse } from '../types';

const router = Router();

// GET /api/GetMachine3F/:MachineNO
router.get('/GetMachine3F/:MachineNO', async (req: MachineNORequest, res: Response) => {
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

    conn = await pool3F.getConnection();
    const rows = await conn.query(
      'SELECT * FROM t_machine where MachineNO=? LIMIT 20',
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