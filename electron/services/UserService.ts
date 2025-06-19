import { User } from "../db/entities/User"
import { AppDataSource } from "../db/data-source"
import { IpcMainAction, IpcHandle } from "../utils"

@IpcMainAction("UserService")
export class UserService {
  private userRepository = AppDataSource.getRepository(User)

  @IpcHandle
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user)
    return await this.userRepository.save(newUser)
  }

  @IpcHandle
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id })
  }

  @IpcHandle
  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  @IpcHandle
  async update(id: number, user: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, user)
    return await this.findById(id)
  }

  @IpcHandle
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}

