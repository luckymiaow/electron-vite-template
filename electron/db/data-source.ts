import "reflect-metadata"
import { DataSource } from "typeorm"
import { app } from 'electron'
import { join } from "node:path"
import { User } from "./entities/User"
import { Book } from "./entities/Book"

const dbPath = join(app.getPath("userData"), "data_local.db");
console.log('[ dbPath ]', dbPath)

const isDev = !app.isPackaged;

console.log('[ isDev ]', isDev)

const migrationsPath = isDev
  ? join(__dirname, "migrations", "*.{ts,js}")
  : join(app.getAppPath(), "dist-electron", "migrations", "*.js");

console.log('[ migrationsPath ]', migrationsPath)

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  synchronize: true,
  logging: true,
  entities: [User, Book],
  // migrations: [migrationsPath],
  // migrationsTableName: "migrations",
  // migrationsRun: true,
  subscribers: [],
}) 