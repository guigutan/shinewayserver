"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool3F = exports.pool2F = exports.pool1F = void 0;
const mariadb_1 = __importDefault(require("mariadb"));
// 数据库连接池配置
const createPool = (dbName) => mariadb_1.default.createPool({
    host: '61.142.21.100',
    port: 33061,
    user: 'root',
    password: 'Aa111111',
    database: dbName,
    connectionLimit: 10
});
// 导出各楼层的连接池
exports.pool1F = createPool('db_ScadaBrother');
exports.pool2F = createPool('db_scadasyntec');
exports.pool3F = createPool('db_scadafanuc');
