import express from 'express';
import cors from 'cors';
import { SERVER_CONFIG } from './config/config';
import { testDbConnection } from './config/db';
import userRoutes from './routes/user.routes';

// 创建 Express 应用
const app = express();
const PORT = SERVER_CONFIG.PORT;

// 中间件
app.use(cors()); // 跨域支持
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 路由
app.use('/api/users', userRoutes); // 用户相关路由
app.get('/', (req, res) => {
  res.send('Hello Express + TypeScript + MariaDB! (无 .env 版本)');
});

// 全局错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器内部错误',
    error: SERVER_CONFIG.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务
const startServer = async () => {
  await testDbConnection(); // 测试数据库连接
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });
};

startServer();