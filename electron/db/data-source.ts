import "reflect-metadata"
import { DataSource } from "typeorm"
import { app } from 'electron'
import { join } from "node:path"
import { User } from "./entities/User"
import { Book } from "./entities/Book"

const dbPath = join(app.getPath("userData"), "data_local.db");
console.log('[ dbPath ]', dbPath)



export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  synchronize: true,
  logging: true,
  entities: [User, Book],
  subscribers: [],
}) 