"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// POST /api/GetSum2F
router.post('/GetSum2F', async (req, res) => {
    const { DayT1, DayT2, LastT1, LastT2, ThisT1, ThisT2 } = req.body;
    let conn;
    try {
        conn = await db_1.pool2F.getConnection();
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
        const successRes = {
            success: true,
            data: rows
        };
        res.json(successRes);
    }
    catch (err) {
        console.error('2楼统计查询失败：', err);
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
