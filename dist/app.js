"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os")); // 显式导入 os 模块（替代 require，符合 ESModule 规范）
// 导入路由模块（保持原有导入逻辑）
const machine1F_1 = __importDefault(require("./routes/machine1F"));
const machine2F_1 = __importDefault(require("./routes/machine2F"));
const machine3F_1 = __importDefault(require("./routes/machine3F"));
const led1F_1 = __importDefault(require("./routes/led1F"));
const led2F_1 = __importDefault(require("./routes/led2F"));
const led3F_1 = __importDefault(require("./routes/led3F"));
const sum1F_1 = __importDefault(require("./routes/sum1F"));
const sum2F_1 = __importDefault(require("./routes/sum2F"));
const sum3F_1 = __importDefault(require("./routes/sum3F"));
const newscada1F_1 = __importDefault(require("./routes/newscada1F"));
const newscada2F_1 = __importDefault(require("./routes/newscada2F"));
const newscada3F_1 = __importDefault(require("./routes/newscada3F"));
const MachineHoursSum1F_1 = __importDefault(require("./routes/MachineHoursSum1F"));
const MachineHoursSum2F_1 = __importDefault(require("./routes/MachineHoursSum2F"));
const MachineHoursSum3F_1 = __importDefault(require("./routes/MachineHoursSum3F"));
// 创建Express实例
const app = (0, express_1.default)();
const PORT = 3000;
const HOST = '0.0.0.0';
// 全局中间件
app.set('case sensitive routing', false);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 挂载所有路由（统一前缀 /api）
app.use('/api', machine1F_1.default);
app.use('/api', machine2F_1.default);
app.use('/api', machine3F_1.default);
app.use('/api', led1F_1.default);
app.use('/api', led2F_1.default);
app.use('/api', led3F_1.default);
app.use('/api', sum1F_1.default);
app.use('/api', sum2F_1.default);
app.use('/api', sum3F_1.default);
app.use('/api', newscada1F_1.default);
app.use('/api', newscada2F_1.default);
app.use('/api', newscada3F_1.default);
app.use('/api', MachineHoursSum1F_1.default);
app.use('/api', MachineHoursSum2F_1.default);
app.use('/api', MachineHoursSum3F_1.default);
// 封装获取本机IP的函数（类型安全）
const getLocalIP = () => {
    // 获取所有网络接口
    const interfaces = os_1.default.networkInterfaces();
    // 遍历以太网接口（兼容中文/英文网卡名：以太网 / Ethernet）
    const ethernetInterface = interfaces['以太网'] || interfaces['Ethernet'];
    if (ethernetInterface) {
        // 显式声明 item 类型为 NetworkInterfaceInfo，解决 any 警告
        const ipv4 = ethernetInterface.find((item) => {
            return item.family === 'IPv4' && !item.internal;
        });
        return ipv4?.address || '192.168.x.x';
    }
    // 兜底：遍历所有接口找可用IPv4
    for (const key in interfaces) {
        const ipv4 = interfaces[key]?.find((item) => {
            return item.family === 'IPv4' && !item.internal;
        });
        if (ipv4)
            return ipv4.address;
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
exports.default = app;
