步骤 1: 创建项目（同之前）bash
mkdir my-express-backend
cd my-express-backend
npm init -y


步骤 2: 安装依赖（去掉 dotenv）bash
npm install express@5 mariadb
npm install typescript ts-node @types/express @types/node nodemon --save-dev


步骤 3: 配置 TypeScript（tsconfig.json 同之前）在项目根目录创建 tsconfig.json：
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}


步骤 4: package.json 脚本json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "nodemon src/index.ts --exec ts-node"
}


步骤 5: 创建代码目录和主文件bash
mkdir src
touch src/index.ts




步骤 6: 编写 src/index.ts（配置直接硬编码）typescript

import express, { Express, Request, Response } from 'express';
import mariadb from 'mariadb';

const app: Express = express();
const port = 3000; // 也可以改成你想要的端口

app.use(express.json());

// ===== 直接在这里填写你的 MariaDB 配置 =====
const pool = mariadb.createPool({
  host: 'localhost',              // 修改为你的主机地址（如 127.0.0.1 或远程 IP）
  port: 3306,                     // MariaDB 默认端口
  user: 'your_username',          // 替换成你的 MariaDB 用户名（如 root）
  password: 'your_password',      // 替换成你的密码
  database: 'your_database_name', // 替换成你要连接的数据库名
  connectionLimit: 10             // 连接池大小，可根据需要调整
});
// ============================================

// 测试数据库连接并获取版本
app.get('/db-version', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT VERSION() AS version');
    res.json({ version: rows[0].version });
  } catch (err: any) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database connection failed', message: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 简单根路由
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript + MariaDB Backend (hardcoded config) is running!');
});

// 示例：查询某张表的所有数据（根据实际情况修改表名）
app.get('/users', async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users LIMIT 20'); // 改成你的表名
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Query failed', message: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});








解决方案（一步步操作）在你的项目目录下（D:\www\shinewayserver）执行以下命令：bash

npm install --save-dev @types/express @types/node

这行命令会安装：@types/express：给 express 提供 TypeScript 类型支持（必须）
@types/node：给 Node.js 内置模块（如 process、__dirname 等）提供类型支持（强烈推荐）

