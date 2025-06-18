import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Display } from "../utils/description"

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column("varchar")
  @Display("书名")
  name: string = ""

  @Column("varchar")
  @Display("作者")
  author: string = ""

  @Column("varchar")
  @Display("类型")
  type: string = ""

  @CreateDateColumn()
  createdAt: Date = new Date()

  @UpdateDateColumn()
  updatedAt: Date = new Date()
} 