
import { LocalDB } from "../utils/_db";
import { Book } from "../models/Book";
import { IpcMainAction } from "../utils/utils";

@IpcMainAction("BookService")
export class BookService extends LocalDB<typeof Book> {

  constructor() {
    super(Book, 'Book');
  }


   async getBooks(): Promise<Book[]> {
    return await this._table.select("*");
  }

}

