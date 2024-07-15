type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};


export function mergeDeep<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceKey = key as keyof typeof source;
    if (typeof source[sourceKey] === "object" && source[sourceKey] !== null && sourceKey in target) {
      const targetValue = target[sourceKey];
      const sourceValue = source[sourceKey];
      output[sourceKey] = mergeDeep(targetValue as any, sourceValue as any);
    } else {
      output[sourceKey] = source[sourceKey] as any;
    }
  });
  return output;
}
