import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Display } from "../utils/description"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column("varchar")
  @Display("用户名")
  name: string = ""

  @Column("varchar")
  @Display("密码")
  password: string = ""

  @Column("varchar")
  email: string = ""

  @Column("varchar")
  avatar: string = ""

  @Column("varchar")
  role: string = ""

  @CreateDateColumn()
  createdAt: Date = new Date()

  @UpdateDateColumn()
  updatedAt: Date = new Date()
} 