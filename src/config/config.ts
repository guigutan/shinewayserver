/**
 * 全局配置常量（测试环境专用，可提交 GitHub）
 * 生产环境请替换为环境变量，切勿提交敏感信息！
 */
export const SERVER_CONFIG = {
  PORT: 3000,
  NODE_ENV: 'development'
} as const; // as const 确保常量不可修改

/**
 * 数据库配置（单数据库示例）
 */
export const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Aa111111', // 测试密码，仅用于本地演示
  database: 'db_ScadaBrother',
  connectionLimit: 10,
  acquireTimeout: 5000,
  socketTimeout: 5000,
  connectTimeout: 5000
} as const;

/**
 * 多数据库配置（可选，如需连接多个库）
 */
export const MULTI_DB_CONFIG = {
  userDb: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Aa111111',
    database: 'db_ScadaBrother',
    connectionLimit: 5
  },
  orderDb: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Aa111111',
    database: 'db_ScadaFANUC',
    connectionLimit: 5
  }
} as const;