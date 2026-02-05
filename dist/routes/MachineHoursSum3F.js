"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// POST /api/MachineHoursSum3F
router.post('/MachineHoursSum3F', async (req, res) => {
    const { MachineNO, ScadaNOT1, ScadaNOT2 } = req.body;
    let conn;
    try {
        conn = await db_1.pool3F.getConnection();
        const sql = `
      SELECT  LEFT(ScadaNO,10) AS ScadaNO,SUM(WkcntrCount) AS WkcntrCount  FROM t_scadadata 
        WHERE MachineID=(SELECT MachineID FROM t_machine WHERE MachineNO=?) 
        AND ScadaNO>=? AND ScadaNO<?
        GROUP BY LEFT(ScadaNO,10)
        ORDER BY LEFT(ScadaNO,10) ; 
            `;
        const params = [MachineNO, ScadaNOT1, ScadaNOT2];
        const rows = await conn.query(sql, params);
        const successRes = {
            success: true,
            data: rows
        };
        res.json(successRes);
    }
    catch (err) {
        console.error('1楼统计查询失败：', err);
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
