import mariadb from 'mariadb';
import { DB_CONFIG } from './config';

// 创建 MariaDB 连接池
const pool = mariadb.createPool(DB_CONFIG);

// 测试数据库连接
const testDbConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MariaDB 连接成功！');
    conn.release();
  } catch (err) {
    console.error('❌ MariaDB 连接失败：', err);
    process.exit(1); // 连接失败则退出进程
  }
};

// 导出连接池和测试函数
export { pool, testDbConnection };