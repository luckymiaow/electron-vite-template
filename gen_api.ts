import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { ipcRenderer } from "electron";

const template = `
import { ipcRenderer } from "electron";
{{imports}}

export const api = {
{{api_groups}}
} as const;
`;

export function readServices() {
  const dir = "services";
  const servicesDir = path.join(__dirname, 'electron/' + dir);
  const files = fs.readdirSync(servicesDir).filter(file => file !== 'index.ts');

  // 生成 import 语句
  const importServices = files.map(file => {
    const name = file.split('.')[0];
    return `import type { ${name} } from "~/${dir}/${name}";`;
  }).join('\n');

  // 生成每个服务的分组对象
  let apiGroups: string[] = [];
  for (const file of files) {
    const name = file.split('.')[0];
    const filePath = path.join(servicesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    // 匹配带装饰器的方法
    // 支持 @IpcHandle/@IpcOn/@IpcOnce
    const methodRegex = /@(IpcHandle|IpcOn|IpcOnce)\s*\n\s*(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/g;
    let match;
    let groupMethods: string[] = [];
    while ((match = methodRegex.exec(content)) !== null) {
      const decorator = match[1];
      const method = match[2];
      if (decorator === 'IpcHandle') {
        groupMethods.push(`  ${method}: ((...args) => ipcRenderer.invoke("${name}.${method}", ...args)) as ${name}['${method}']`);
      } else if (decorator === 'IpcOn' || decorator === 'IpcOnce') {
        groupMethods.push(`  ${method}: ((...args) => ipcRenderer.send("${name}.${method}", ...args)) as ${name}['${method}']`);
      }
    }
    apiGroups.push(`  ${name}: {\n${groupMethods.join(',\n')}\n  }`);
  }

  const str = template
    .replace('{{imports}}', importServices)
    .replace('{{api_groups}}', apiGroups.join(',\n'));

  fs.writeFileSync(path.join(__dirname, 'src/api/index.ts'), str);
}