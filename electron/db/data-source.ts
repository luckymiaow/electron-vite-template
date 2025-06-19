import "reflect-metadata"
import { DataSource } from "typeorm"
import { app } from 'electron'
import { join } from "path"
import { User } from "./entities/User"
import { Book } from "./entities/Book"

const dbPath = join(app.getPath("userData"), "data_local.db");
console.log('[ dbPath ]', dbPath)

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  synchronize: false,
  logging: true,
  entities: [User, Book],
  migrations: [join(__dirname, "migrations", "*.{ts,js}")],
  migrationsTableName: "migrations",
  migrationsRun: true,
  subscribers: [],
}) 