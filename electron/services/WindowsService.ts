// electron/main/windows.ts
import { BrowserWindow } from 'electron'
import path from 'path'
import { IpcMainAction } from '../utils'

export const WINDOWS = new Map<string, BrowserWindow>()

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

let icon: string

export function createMainWindow(): BrowserWindow | null {
  icon = path.join(process.env.VITE_PUBLIC, 'icon.ico');

  let win: BrowserWindow | null

  win = new BrowserWindow({
    icon,
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
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

  createWindow(route: { name: string, path: string }, parent?: string) {
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
        nodeIntegration: false,
        contextIsolation: true,
      }
    })

    const url = process.env.VITE_DEV_SERVER_URL || ''
    if (url) {
      child.webContents.openDevTools()
      child.loadURL(`${url}#${route.path}`)
    } else {
      // 生产环境
      child.loadFile(path.join(__dirname, '../dist/index.html'), {
        hash: route.path
      })
    }
    child.on('closed', () => {
      WINDOWS.delete(name)
    })

    WINDOWS.set(name as string, child)
  }

  refreshWindow(name: string,) {
    if (WINDOWS.has(name)) {
      const w = WINDOWS.get(name);
      if (!w) return;
      w.focus()
      w.reload()
    }
  }
}
