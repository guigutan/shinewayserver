"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// GET /api/GetLed1F/:ScadaNO
router.get('/GetLed1F/:ScadaNO', async (req, res) => {
    const { ScadaNO } = req.params;
    let conn;
    try {
        if (!ScadaNO) {
            const errorRes = {
                success: false,
                message: 'ScadaNO 不能为空'
            };
            return res.status(400).json(errorRes);
        }
        conn = await db_1.pool1F.getConnection();
        const rows = await conn.query(`SELECT 
        MachineNO ,
        IFNULL((SELECT LedStatus FROM t_scadadata WHERE t_scadadata.MachineID=t_machine.MachineID AND t_scadadata.ScadaNO=?),-1) AS 'LedStatus',
        trCount,
        tdCount,
        colIndex
      FROM t_machine WHERE MachineStatus>0  
      ORDER BY t_machine.OrderBy `, [ScadaNO]);
        const successRes = {
            success: true,
            data: rows
        };
        res.json(successRes);
    }
    catch (err) {
        console.error('1楼Led查询失败：', err);
        const errorRes = {
            success: false,
            message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
        };
        res.status(500).json(errorRes);
    }
    finally {
        if (conn)
            conn.release();
    }
});
exports.default = router;
