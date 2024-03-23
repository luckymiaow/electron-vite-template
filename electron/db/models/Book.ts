import { Display } from "../utils/description";
import { Identifiable } from "./_Identifiable";

export class Book implements Identifiable {
  @Display("Id",{ignore:true})
  id: number | undefined;
  /* t */
  @Display("书名")
  name: string = "";

}
