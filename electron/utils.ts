import { ipcMain } from "electron";

const IPC_METHODS_KEY = Symbol('ipc_methods');
type IpcMethodType = 'handle' | 'on' | 'once';

interface IpcMethodMeta {
  type: IpcMethodType;
  method: string;
}

// 定义异步方法的类型
type AsyncMethod = (...args: any[]) => Promise<any>;

// 定义装饰器目标类型
interface DecoratorTarget {
  [IPC_METHODS_KEY]?: IpcMethodMeta[];
  [key: string]: any;
}

// 检查方法是否为异步函数的类型
type IsAsyncMethod<T> = T extends (...args: any[]) => Promise<any> ? true : false;

// 条件类型：如果方法不是异步的，则返回 never
type AsyncMethodOnly<T> = IsAsyncMethod<T> extends true ? T : never;

// 装饰器类型：只接受异步方法
type IpcHandleDecorator = <T extends DecoratorTarget, K extends keyof T>(
  target: T & { [P in K]: AsyncMethodOnly<T[K]> },
  propertyKey: K
) => void;

function addIpcMeta(target: DecoratorTarget, method: string, type: IpcMethodType) {
  if (!target[IPC_METHODS_KEY]) target[IPC_METHODS_KEY] = [];
  target[IPC_METHODS_KEY].push({ type, method });
}

/**
 * 被装饰的方法必须是异步的
 * 类型约束确保只有异步方法才能被装饰
 * @param target 装饰器目标对象
 * @param propertyKey 属性键名
 */
export const IpcHandle: IpcHandleDecorator = function (target: DecoratorTarget, propertyKey: string) {
  const method = target[propertyKey];

  // 检查方法是否存在
  if (!method) {
    throw new Error(`方法 ${propertyKey} 不存在`);
  }

  // 检查方法是否为异步函数
  if (typeof method !== 'function') {
    throw new Error(`属性 ${propertyKey} 不是一个函数`);
  }

  // 检查是否为异步函数（返回 Promise）
  const originalMethod = method as AsyncMethod;
  const isAsync = originalMethod.constructor.name === 'AsyncFunction' ||
    originalMethod.toString().includes('async');

  if (!isAsync) {
    throw new Error(`方法 ${propertyKey} 必须是异步函数 (async function)`);
  }

  addIpcMeta(target, propertyKey, 'handle');
} as IpcHandleDecorator;

export function IpcOn(target: DecoratorTarget, propertyKey: string) {
  addIpcMeta(target, propertyKey, 'on');
}

export function IpcOnce(target: DecoratorTarget, propertyKey: string) {
  addIpcMeta(target, propertyKey, 'once');
}

export function IpcMainAction(key: string) {
  return function (target: any) {
    const prototype = target.prototype;
    const metas: IpcMethodMeta[] = prototype[IPC_METHODS_KEY] || [];
    for (const { type, method } of metas) {
      const path = `${key}.${method}`;
      if (type === 'handle') {
        ipcMain.handle(path, async (_, ...args) => {
          const ev = new target();
          return await ev[method](...args);
        });
      } else if (type === 'on') {
        ipcMain.on(path, (event, ...args) => {
          const ev = new target();
          ev[method](event, ...args);
        });
      } else if (type === 'once') {
        ipcMain.once(path, (event, ...args) => {
          const ev = new target();
          ev[method](event, ...args);
        });
      }
    }
  }
}
