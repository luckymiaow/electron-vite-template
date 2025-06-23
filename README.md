# electron-vite-template

## 项目亮点

- ⚡ 基于 Electron + Vite + Vue3 + TypeScript 的现代桌面应用开发模板
- 🛠️ 后端服务（主进程）采用装饰器自动注册，前端 API 自动生成，前后端类型强关联
- 🗃️ 集成 TypeORM，支持 SQL 查询与实体表格自动生成
- 📦 现代前端工程体系，支持热更新、类型推断、自动导入
- 🧩 代码结构清晰，易于扩展和维护
- 🖥️ 支持多窗口管理，适合复杂桌面应用开发

---

## 目录结构

```
electron-vite-template/
├─ electron/           # Electron 主进程相关代码
│  ├─ db/              # 数据库相关（实体、数据源、工具等）
│  ├─ services/        # 主进程服务（如窗口、用户、图书等，支持自动注册）
│  ├─ main.ts          # 主进程入口
│  └─ preload.ts       # 预加载脚本
├─ src/                # 渲染进程（前端）代码
│  ├─ api/             # 自动生成的前端 API
│  ├─ components/      # Vue 组件
│  ├─ pages/           # 页面
│  └─ main.ts          # 前端入口
├─ public/             # 静态资源
├─ gen_api.ts          # API 自动生成脚本
├─ package.json        # 项目依赖与脚本
└─ README.md           # 项目说明
```

---

## 后端服务封装（@/electron/services）

- 所有主进程服务统一放在 `electron/services/` 目录下。
- 通过装饰器（如 `@IpcHandle`、`@IpcOn`、`@IpcOnce`）自动注册 IPC 通信方法。
- 只需在服务类中为方法添加装饰器，即可自动暴露给前端调用，无需手动注册。

示例（`electron/services/BookService.ts`）：

```ts
import { IpcHandle } from '装饰器路径';

export class BookService {
  @IpcHandle
  async getBooks() {
    // 查询数据库并返回
  }
}
```

---

## API 自动生成与使用

### 1. API 自动生成

- 开发环境下，Vite 插件会自动扫描 `electron/services/` 目录下所有带装饰器的方法，自动生成类型安全的前端 API 封装，输出到 `src/api/index.ts`，无需手动执行命令。

### 2. 前端调用方式

- 直接在前端通过 `api` 对象调用，无需手动维护 IPC 通信代码。

示例（`src/pages/index.vue`）：

```ts
import { api } from '@/api';

const books = await api.BookService.getBooks();
```

- 支持类型推断和自动补全，开发体验极佳。

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

- 启动后会自动打开 Electron 应用窗口，支持热更新。

### 3. 打包应用

```bash
npm run build
```

- 构建生产环境包，输出到 `dist` 和 `dist-electron` 目录。

---

## 推荐开发环境

- VS Code + Volar 插件（建议禁用 Vetur）
- 启用 Volar 的 Take Over Mode，获得更佳的 TypeScript 支持体验

---

## 其他

如需自定义数据库、接口或页面，可参考 `electron/db` 和 `src/api` 目录下的示例进行扩展。

---

如需进一步完善或有特殊说明需求，请补充具体细节！
