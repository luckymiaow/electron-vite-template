
import { ipcRenderer } from "electron";
import { PrefixedServices } from "./utils/type";

import type { BookService } from "~/services/BookService";
import type { UserService } from "~/services/UserService";
import type { WindowsService } from "~/services/WindowsService";

type Services = PrefixedServices<typeof BookService.prototype,'BookService'> &  
PrefixedServices<typeof UserService.prototype,'UserService'> &  
PrefixedServices<typeof WindowsService.prototype,'WindowsService'>

export function api<T extends keyof Services>(path: T,...args:Parameters<Services[T]>){
  return ipcRenderer.invoke(path, ...args) as  ReturnType<Services[T]>;
}

