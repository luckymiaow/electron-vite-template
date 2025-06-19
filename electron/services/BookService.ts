import { Book } from "../db/entities/Book"
import { AppDataSource } from "../db/data-source"
import { IpcMainAction, IpcHandle } from "../utils"

@IpcMainAction("BookService")
export class BookService {
  private bookRepository = AppDataSource.getRepository(Book)

  @IpcHandle
  async create(book: Partial<Book>): Promise<Book> {
    const newBook = this.bookRepository.create(book)
    return await this.bookRepository.save(newBook)
  }

  @IpcHandle
  async findById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id })
  }

  @IpcHandle
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find()
  }

  @IpcHandle
  async update(id: number, book: Partial<Book>): Promise<Book | null> {
    await this.bookRepository.update(id, book)
    return await this.findById(id)
  }

  @IpcHandle
  async delete(id: number): Promise<void> {
    await this.bookRepository.delete(id)
  }
}

