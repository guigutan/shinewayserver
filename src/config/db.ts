import mariadb from 'mariadb';

// 数据库连接池配置
const createPool = (dbName: string) => 
  mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Aa111111',
    database: dbName,
    connectionLimit: 10
  });

// 导出各楼层的连接池
export const pool1F = createPool('db_ScadaBrother');
export const pool2F = createPool('db_scadasyntec');
export const pool3F = createPool('db_scadafanuc');      