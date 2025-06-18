import { app } from 'electron'
import { AppDataSource } from '../db/data-source'

app.whenReady().then(async () => {
  // 初始化 TypeORM 连接
  try {
    await AppDataSource.initialize()
    console.log("数据库连接成功")
  } catch (error) {
    console.error("数据库连接失败:", error)
  }
}) 