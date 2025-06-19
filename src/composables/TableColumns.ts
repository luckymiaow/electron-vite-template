import { DisplayOptions } from "~/db/utils/description";

export function TableColumns<T extends new () => any>(model: T) {
  const data = new model();
  const desc = model.prototype.$desc as Record<string, DisplayOptions>;
  return Object.keys(data).flatMap(v => {
    if (desc?.[v]?.ignore) return [];
    return {
      dataIndex: v,
      title: desc?.[v]?.desc ?? v
    }
  })
}