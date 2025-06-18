const { DataSourceOptions } = require("typeorm")
const { app } = require('electron')
const { join } = require("path")
const { User } = require("./entities/User")
const { Book } = require("./entities/Book")

const config = {
  type: "sqlite",
  database: join(app.getPath("userData"), "local.db"),
  synchronize: false,
  logging: true,
  entities: [User, Book],
  migrations: [join(__dirname, "migrations", "*.{ts,js}")],
  migrationsTableName: "migrations",
  migrationsRun: true,
  subscribers: [],
}

module.exports = config 