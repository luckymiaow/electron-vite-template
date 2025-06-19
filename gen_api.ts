import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { ipcRenderer } from "electron";
import { PrefixedServices } from "./utils/type";

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