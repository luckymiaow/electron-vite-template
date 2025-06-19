import { ipcMain } from "electron";

const IPC_METHODS_KEY = Symbol('ipc_methods');
type IpcMethodType = 'handle' | 'on' | 'once';

interface IpcMethodMeta {
  type: IpcMethodType;
  method: string;
}

function addIpcMeta(target: any, method: string, type: IpcMethodType) {
  if (!target[IPC_METHODS_KEY]) target[IPC_METHODS_KEY] = [];
  target[IPC_METHODS_KEY].push({ type, method });
}

export function IpcHandle(target: any, propertyKey: string) {
  addIpcMeta(target, propertyKey, 'handle');
}
export function IpcOn(target: any, propertyKey: string) {
  addIpcMeta(target, propertyKey, 'on');
}
export function IpcOnce(target: any, propertyKey: string) {
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
