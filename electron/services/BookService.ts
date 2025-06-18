import { Book } from "../db/entities/Book"
import { AppDataSource } from "../db/data-source"
import { IpcMainAction } from "../utils"

@IpcMainAction("BookService")
export class BookService {
  private bookRepository = AppDataSource.getRepository(Book)

  async create(book: Partial<Book>): Promise<Book> {
    const newBook = this.bookRepository.create(book)
    return await this.bookRepository.save(newBook)
  }

  async findById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id })
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find()
  }

  async update(id: number, book: Partial<Book>): Promise<Book | null> {
    await this.bookRepository.update(id, book)
    return await this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id)
  }
}

