
export type DisplayOptions = {
  desc?: string
  ignore: boolean
};

export function Display(desc: string, options?: DisplayOptions) {
  return function (target: any, key: string) {
    let descriptions = target.$desc;
    if (!descriptions) {
      descriptions = {};
      Object.defineProperty(target, '$desc', {
        value: descriptions,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
    descriptions[key] = {
      desc,
      ...options
    } as DisplayOptions;
  };
}

