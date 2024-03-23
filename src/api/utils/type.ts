export type RendererService<T> = Omit<T, keyof T extends infer K ? K extends string ? K extends `_${string}` ? K : never : never : never>;

export type PrefixedServices<T, U extends string> = {
  [K in keyof RendererService<T> & string  as `${U}.${K}`]: T[K];
}