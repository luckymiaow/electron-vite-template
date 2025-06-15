import { Display } from "../utils/description";
import { Identifiable } from "./_Identifiable";

export class CategoryMenu implements Identifiable {
  @Display("Id", { ignore: true })
  id: number | undefined;

  @Display("主分类名称")
  mainName: string = "";

  @Display("分类名称")
  name: string = "";

  @Display("url")
  url: string = ""
}
