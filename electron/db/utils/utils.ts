import { ipcMain, } from "electron";


export function filter<T>(v: T){
  return typeof v === 'string' && v !== 'constructor' && !v.startsWith('_')
}

export function IpcMainAction(key: string) {
  return function(target: any) {
    const prototype = target.prototype;
    const keys0 = Object.getOwnPropertyNames(Object.getPrototypeOf(prototype)).filter(filter);
    const keys = Object.getOwnPropertyNames(prototype).filter(filter) as string[];
    for (const method of [...keys, ...keys0]) {
      if(typeof prototype[method] !== 'function') continue;
      const path = `${key}.${method}`;
      ipcMain.handle(path, async (event, args) => {
        const ev = new target();
        return await ev[method](args);
      });
    }
  }
}
