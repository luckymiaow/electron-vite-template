import fs from 'fs';
import path from 'path';

const template = `
import { ipcRenderer } from "electron";
import { PrefixedServices } from "./utils/type";

{{services}}

export function api<T extends keyof Services>(path: T,...args:Parameters<Services[T]>){
  return ipcRenderer.invoke(path, ...args) as  ReturnType<Services[T]>;
}

`

export function readServices() {
  const dir = "services"
  const servicesDir = path.join(__dirname, 'electron/' + dir);

  const files = fs.readdirSync(servicesDir).filter(file => file !== 'index.ts');

  const importServices = files.map(file => {
    const name = file.split('.')[0];
    return `import type { ${name} } from "~/${dir}/${name}";`
  }).join('\n');

  const services = "type Services = " + files.map(file => {
    const name = file.split('.')[0];
    return `PrefixedServices<typeof ${name}.prototype,'${name}'>`
  }).join(' &  \n');

  const str = template.replace('{{services}}', importServices + '\n\n' + services);



  fs.writeFileSync(path.join(__dirname, 'src/api/index.ts'), str);

}