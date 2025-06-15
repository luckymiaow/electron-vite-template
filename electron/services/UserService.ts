
import { LocalDB } from "../db/utils/_db";
import { IpcMainAction } from "../utils";
import { User } from "../db/models/User";

@IpcMainAction("UserService")
export class UserService extends LocalDB<typeof User> {

  constructor() {
    super(User, 'User');
  }



}

