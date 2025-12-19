import { Request, Response } from 'express';


// 通用响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: number;
}




// ScadaNO 参数请求
export interface ScadaNORequest extends Request {
  params: { ScadaNO?: string };
}
// MachineNO 参数请求
export interface MachineNORequest extends Request {
  params: { MachineNO?: string };
}






// 统计接口请求体
export interface SumRequestBody {
  DayT1?: string;
  DayT2?: string;
  LastT1?: string;
  LastT2?: string;
  ThisT1?: string;
  ThisT2?: string;

  MachineNO?: string;
  ScadaNOT1?: string;
  ScadaNOT2?: string;

}
export type SumRequest = Request<{}, {}, SumRequestBody>;
