
import { ipcRenderer } from "electron";
import { PrefixedServices } from "./utils/type";

import type { BookService } from "~/db/services/BookService";
import type { UserService } from "~/db/services/UserService";

type Services = PrefixedServices<typeof BookService.prototype, 'BookService'> &
  PrefixedServices<typeof UserService.prototype, 'UserService'>

export function api<T extends keyof Services>(path: T, ...args: Parameters<Services[T]>) {
  return ipcRenderer.invoke(path, ...args) as ReturnType<Services[T]>;
}

