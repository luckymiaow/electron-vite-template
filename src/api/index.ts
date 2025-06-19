
import { ipcRenderer } from "electron";
import type { BookService } from "~/services/BookService";
import type { UserService } from "~/services/UserService";
import type { WindowsService } from "~/services/WindowsService";

export const api = {
  BookService: {
  create: ((...args) => ipcRenderer.invoke("BookService.create", ...args)) as BookService['create'],
  findById: ((...args) => ipcRenderer.invoke("BookService.findById", ...args)) as BookService['findById'],
  findAll: ((...args) => ipcRenderer.invoke("BookService.findAll", ...args)) as BookService['findAll'],
  update: ((...args) => ipcRenderer.invoke("BookService.update", ...args)) as BookService['update'],
  delete: ((...args) => ipcRenderer.invoke("BookService.delete", ...args)) as BookService['delete']
  },
  UserService: {
  create: ((...args) => ipcRenderer.invoke("UserService.create", ...args)) as UserService['create'],
  findById: ((...args) => ipcRenderer.invoke("UserService.findById", ...args)) as UserService['findById'],
  findAll: ((...args) => ipcRenderer.invoke("UserService.findAll", ...args)) as UserService['findAll'],
  update: ((...args) => ipcRenderer.invoke("UserService.update", ...args)) as UserService['update'],
  delete: ((...args) => ipcRenderer.invoke("UserService.delete", ...args)) as UserService['delete']
  },
  WindowsService: {
  findAll: ((...args) => ipcRenderer.invoke("WindowsService.findAll", ...args)) as WindowsService['findAll'],
  createWindow: ((...args) => ipcRenderer.invoke("WindowsService.createWindow", ...args)) as WindowsService['createWindow'],
  refreshWindow: ((...args) => ipcRenderer.invoke("WindowsService.refreshWindow", ...args)) as WindowsService['refreshWindow']
  }
} as const;
