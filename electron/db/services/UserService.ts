
import { LocalDB } from "../utils/_db";
import { IpcMainAction } from "../utils/utils";
import { User } from "../models/User";

@IpcMainAction("UserService")
export class UserService extends LocalDB<typeof User> {

  constructor() {
    super(User, 'User');
  }



}

