import { Router, Response } from 'express';
import { pool2F } from '../config/db';
import { ScadaNORequest, ApiResponse } from '../types';

const router = Router();

// GET /api/GetLed2F/:ScadaNO
router.get('/GetLed2F/:ScadaNO', async (req: ScadaNORequest, res: Response) => {
  const { ScadaNO } = req.params;
  let conn;

  try {
    if (!ScadaNO) {
      const errorRes: ApiResponse = {
        success: false,
        message: 'ScadaNO 不能为空'
      };
      return res.status(400).json(errorRes);
    }

    conn = await pool2F.getConnection();
    const rows = await conn.query(
      `SELECT 
        MachineNO ,
        IFNULL((SELECT LedStatus FROM t_scadadata WHERE t_scadadata.MachineID=t_machine.MachineID AND t_scadadata.ScadaNO=?),-1) AS 'LedStatus'
      FROM t_machine 
      ORDER BY t_machine.OrderBy `,
      [ScadaNO]
    );

    const successRes: ApiResponse = {
      success: true,
      data: rows
    };
    res.json(successRes);
  } catch (err: any) {
    console.error('2楼Led查询失败：', err);
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