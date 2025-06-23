// electron/main/windows.ts
import { BrowserWindow } from 'electron'
import path from 'node:path'
import { IpcHandle, IpcMainAction } from '../utils'
import { RouteLocationRaw } from 'vue-router'

export const WINDOWS = new Map<string, BrowserWindow>()

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

let icon: string | undefined = process.env.VITE_PUBLIC;

export function createMainWindow(): BrowserWindow | null {
  let win: BrowserWindow | null

  win = new BrowserWindow({
    icon,
    width: 1440,
    height: 730,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools()
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  WINDOWS.set('main', win)
  return win
}

@IpcMainAction("WindowsService")
export class WindowsService {

  @IpcHandle
  async findAll() {
    return WINDOWS.keys();
  }

  @IpcHandle
  async createWindow(route: { name: string, path: RouteLocationRaw }, parent?: string) {
    const name = route.name;
    if (WINDOWS.has(name)) {
      WINDOWS.get(name)?.focus()
      return WINDOWS.get(name)!
    }
    const child = new BrowserWindow({
      icon,
      width: 1080,
      height: 1080,
      parent: parent ? WINDOWS.get(parent) : undefined,
      frame: true,
      autoHideMenuBar: true,
      x: 100,
      y: 50,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    if (VITE_DEV_SERVER_URL) {
      child.webContents.openDevTools()
      child.loadURL(`${VITE_DEV_SERVER_URL}#${route.path}`)
    } else {
      // 生产环境
      child.loadFile(path.join(__dirname, '../dist/index.html'), {
        hash: route.path as string
      })
    }
    child.on('closed', () => {
      WINDOWS.delete(name)
    })

    WINDOWS.set(name as string, child)
  }

  @IpcHandle
  async refreshWindow(name: string,) {
    if (WINDOWS.has(name)) {
      const w = WINDOWS.get(name);
      if (!w) return;
      w.focus()
      w.reload()
    }
  }
}
