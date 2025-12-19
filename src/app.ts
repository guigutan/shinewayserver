import express from 'express';
import cors from 'cors';

// 导入路由模块
import machine1FRouter from './routes/machine1F';
import machine2FRouter from './routes/machine2F';
import machine3FRouter from './routes/machine3F';
import led1FRouter from './routes/led1F';
import led2FRouter from './routes/led2F';
import led3FRouter from './routes/led3F';
import sum1FRouter from './routes/sum1F';
import sum2FRouter from './routes/sum2F';
import sum3FRouter from './routes/sum3F';
import newscada1FRouter from './routes/newscada1F';
import newscada2FRouter from './routes/newscada2F';
import newscada3FRouter from './routes/newscada3F';
import MachineHoursSum1F from './routes/MachineHoursSum1F';
import MachineHoursSum2F from './routes/MachineHoursSum2F';
import MachineHoursSum3F from './routes/MachineHoursSum3F';

// 创建Express实例
const app = express();
const PORT = 3000;

// 全局中间件
app.set('case sensitive routing', false);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载所有路由（统一前缀 /api）
app.use('/api', machine1FRouter);
app.use('/api', machine2FRouter);
app.use('/api', machine3FRouter);
app.use('/api', led1FRouter);
app.use('/api', led2FRouter);
app.use('/api', led3FRouter);
app.use('/api', sum1FRouter);
app.use('/api', sum2FRouter);
app.use('/api', sum3FRouter);
app.use('/api', newscada1FRouter);
app.use('/api', newscada2FRouter);
app.use('/api', newscada3FRouter);
app.use('/api', MachineHoursSum1F);
app.use('/api', MachineHoursSum2F);
app.use('/api', MachineHoursSum3F);

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务运行于：http://localhost:${PORT} 和 http://本机IP:${PORT}`);
});

// 导出app供测试用（可选）
export default app;