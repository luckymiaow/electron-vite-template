
export function initServices() {
  const services = import.meta.glob('./**/*.ts', { eager: true })

  Object.keys(services).forEach((key) => {
    const names = key.match(/^\.\/(.*)\.ts$/);
    if (names === null) return;
    new (services as any)[key][names[1]]();
  })

}

