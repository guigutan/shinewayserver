"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// 导入路由模块
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
// 启动服务
app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务运行于：http://localhost:${PORT} 和 http://本机IP:${PORT}`);
});
// 导出app供测试用（可选）
exports.default = app;
