
import { app } from 'electron'
import { Knex } from 'knex';
import { join } from "path";
import { Page } from '../models/_page';

const knex = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: join(app.getPath("userData"), "local.db")
  }
});

type ClassType<T> = T extends new (...args: any[]) => infer R ? R   : never;

export class LocalDB<T  extends new (...args: any[]) => any>  {
  protected declare _db: Knex<ClassType<T>,ClassType<T>>;

  _tableName: string;

  public get _table(){
    return this._db.table(this._tableName)
  };

  constructor(model: T, tableName: string) {
    this._tableName = tableName;
    this._init(model, tableName);
  }

  private async _init(entity: T, tableName: string) {
    if (!entity) throw new Error("entity is required")
    this._tableName = tableName
    this._db = knex;
    await this._sync(entity);
  }

  private async _sync(entity: new (...args: any[]) => any) {
    await this._db.schema.hasTable(this._tableName).then((exist) => {
      if (exist) return;
      const fields = this._getClassFields(new entity())
      return this._db.schema.createTable(this._tableName, (table) => {
        for (const field of fields) {
          const { name, type } = field;
          if (name === "id") { table.bigIncrements("id", { primaryKey: true }); continue; }
          switch (type) {
            case "string":
              table.string(name);
              break;
            case "number":
              table.integer(name);
              break;
            case "boolean":
              table.boolean(name);
              break;
            case "date":
              table.date(name);
              break;
          }
        }
        table.timestamps(true, true);
      });
    });


  }

  private _getClassFields<T>(obj: T): Array<{ name: string, type: string }> {
    const fields: Array<{ name: string, type: string }> = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let type: any = typeof obj[key];
        if (obj[key] instanceof Date) type = "date";

        fields.push({ name: key, type });
      }
    }

    return fields;
  }


  async create(data:Omit<ClassType<T>,'id'> ) {
    if('id' in data) delete data.id;
    return await this._table.insert(data);
  }

  async save(data: ClassType<T>) {
    if(!data.id ){
      this.create(data);
    }else{
      this.update(data);
    }
  }

  async insertMany(data: ClassType<T>[]) {
    return await this._table.insert(data);
  }

  async get(id: number): Promise<ClassType<T>> {
    return await this._table
      .select("*")
      .where("id", "=", id)
      .first() as ClassType<T>;
  }

  async delete(id: number) {
    return await this._table.where("id", "=", id).delete();
  }

  async update(data: ClassType<T>) {
    return await this._table.where("id", "=", data.id)
      .update(data);
  }

  async updateMany(dataList: ClassType<T>[]) {
    try {
      await this._db.transaction(async (trx: any) => {
        for (const data of dataList) {
          await this._table
            .transacting(trx)
            .where('id', data.id)
            .update(data);
        }
        await trx.commit();
      });
    } catch (error) {
      console.error('更新数据失败:', error);
      throw error;
    }
  }

  async getByPage({ limit, offset }: { limit: number; offset: number }): Promise<Page< ClassType<T>>>{
    const total = await this._table.count('* as total')
    const data = await this._table.select("*").orderBy("id", "desc").limit(limit).offset(offset);
    return {
      data,
      total: total[0].total,
      limit,
      offset
    }
  }

  async find(type: string): Promise<ClassType<T>[]>{
    return await this._db
      .table<ClassType<T>>(this._tableName)
      .select("*")
      .where("type", "=", type).first() as ClassType<T>
  }

  async findAll(): Promise<ClassType<T>[]>{
    return await this._db
      .table(this._tableName)
      .select("*") as ClassType<T>[]
  }
}
