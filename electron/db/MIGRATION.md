# 数据库迁移说明

## 目录结构
```
db/
  ├── migrations/          # 迁移文件目录
  │   └── *.ts            # 迁移文件
  ├── entities/           # 实体文件目录
  ├── data-source.ts      # TypeORM 应用配置
  ├── generate-migration.ts # 迁移生成脚本
  └── migration.ts        # 迁移命令脚本
```

## 迁移命令

### 运行迁移
```bash
npm run migration:run
```
此命令会执行所有未执行的迁移文件。

### 回滚迁移
```bash
npm run migration:revert
```
此命令会回滚最后一次执行的迁移。

### 生成迁移
```bash
npm run migration:generate -- 迁移名称
```
此命令会根据实体变更生成迁移文件。
例如：
```bash
npm run migration:generate -- AddUserRole
```

## 迁移文件命名规范
迁移文件名格式：`时间戳-描述.ts`
例如：`1710830000000-CreateInitialTables.ts`

## 创建迁移文件的方式

### 1. 自动生成迁移（推荐）
当您修改了实体文件后，可以使用自动生成命令：
```bash
npm run migration:generate -- migrations/描述性名称
```
TypeORM 会：
1. 比较实体和数据库的差异
2. 自动生成迁移文件
3. 包含所有必要的 up 和 down 方法

### 2. 手动创建迁移
如果需要执行复杂的数据库操作，可以手动创建：
```bash
npm run migration:create -- migrations/描述性名称
```
然后手动编写迁移逻辑。

### 3. 迁移文件示例
自动生成的迁移文件示例：
```typescript
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserRole1710830000000 implements MigrationInterface {
    name = 'AddUserRole1710830000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" varchar NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }
}
```

## 注意事项
1. 迁移文件一旦提交到版本控制，不要修改
2. 每个迁移文件都应该有对应的回滚操作
3. 迁移文件按时间戳顺序执行
4. 在开发新功能时，先创建迁移文件，再修改实体
5. 定期备份数据库
6. 自动生成的迁移文件要仔细检查，确保符合预期
7. 如果遇到 "Cannot use import statement outside a module" 错误，请确保使用 migration.config.ts 而不是 typeorm.config.ts

## 常见问题

### 1. 迁移失败
如果迁移失败，检查：
- 迁移文件语法是否正确
- 数据库连接是否正常
- 是否有冲突的迁移

### 2. 回滚失败
如果回滚失败，检查：
- `down` 方法是否正确实现
- 是否有依赖关系阻止回滚

### 3. 迁移顺序
迁移按时间戳顺序执行，确保：
- 新迁移的时间戳大于已有迁移
- 迁移之间没有循环依赖

### 4. 生成迁移失败
如果生成迁移失败，检查：
- 实体文件是否正确
- 数据库连接是否正常
- 是否有未提交的数据库变更

## 最佳实践
1. 优先使用自动生成迁移
2. 每个迁移文件只做一件事
3. 保持迁移文件简单明了
4. 测试迁移和回滚操作
5. 在开发环境中先测试迁移
6. 定期清理旧的迁移文件
7. 检查自动生成的迁移文件 