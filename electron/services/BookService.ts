
import { LocalDB } from "../db/utils/_db";
import { Book } from "../db/models/Book";
import { IpcMainAction } from "../utils";

@IpcMainAction("BookService")
export class BookService extends LocalDB<typeof Book> {

  constructor() {
    super(Book, 'Book');
  }


  async getBooks(): Promise<Book[]> {
    return await this._table.select("*");
  }

}

