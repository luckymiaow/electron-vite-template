import { Display } from "../utils/description";
import { Identifiable } from "./_Identifiable";

export class User implements Identifiable {
  id: number = 0;
  @Display("用户名")
  name: string = "";
  @Display("密码")
  password: string = "";
  email: string = "";
  avatar: string = "";
  role: string = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

