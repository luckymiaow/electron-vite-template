import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateInitialTables1710830000000 implements MigrationInterface {
  name = 'CreateInitialTables1710830000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建用户表
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "password" varchar NOT NULL,
                "email" varchar NOT NULL,
                "avatar" varchar NOT NULL,
                "role" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

    // 创建书籍表
    await queryRunner.query(`
            CREATE TABLE "book" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "author" varchar NOT NULL,
                "type" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
} 