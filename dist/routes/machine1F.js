"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// GET /api/GetMachine1F/:MachineNO
router.get('/GetMachine1F/:MachineNO', async (req, res) => {
    const { MachineNO } = req.params;
    let conn;
    try {
        if (!MachineNO) {
            const errorRes = {
                code: 400,
                success: false,
                message: 'MachineNO 不能为空'
            };
            return res.status(400).json(errorRes);
        }
        conn = await db_1.pool1F.getConnection();
        const rows = await conn.query('SELECT * FROM t_machine where MachineNO=? LIMIT 20', [MachineNO]);
        const successRes = {
            code: 200,
            success: true,
            data: rows
        };
        res.json(successRes);
    }
    catch (err) {
        console.error('1楼机器查询失败：', err);
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
