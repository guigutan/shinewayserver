import express from 'express';
import cors from 'cors';
import os from 'os'; // 显式导入 os 模块（替代 require，符合 ESModule 规范）
import type { NetworkInterfaceInfo } from 'os'; // 导入 os 模块的类型定义

// 导入路由模块（保持原有导入逻辑）
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
const HOST = '0.0.0.0';

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

// 封装获取本机IP的函数（类型安全）
const getLocalIP = (): string => {
  // 获取所有网络接口
  const interfaces = os.networkInterfaces();
  // 遍历以太网接口（兼容中文/英文网卡名：以太网 / Ethernet）
  const ethernetInterface = interfaces['以太网'] || interfaces['Ethernet'];
  
  if (ethernetInterface) {
    // 显式声明 item 类型为 NetworkInterfaceInfo，解决 any 警告
    const ipv4 = ethernetInterface.find((item: NetworkInterfaceInfo) => {
      return item.family === 'IPv4' && !item.internal;
    });
    return ipv4?.address || '192.168.x.x';
  }
  
  // 兜底：遍历所有接口找可用IPv4
  for (const key in interfaces) {
    const ipv4 = interfaces[key]?.find((item: NetworkInterfaceInfo) => {
      return item.family === 'IPv4' && !item.internal;
    });
    if (ipv4) return ipv4.address;
  }
  
  return '192.168.x.x';
};

// 启动服务
app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`✅ API 服务器启动成功！`);
  console.log(`🔗 本机访问：http://localhost:${PORT}`);
  console.log(`🌐 局域网访问：http://${localIP}:${PORT}`);
});

// 导出app供测试用（可选）
export default app;