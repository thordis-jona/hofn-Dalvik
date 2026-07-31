import { writeFileSync } from 'node:fs';

writeFileSync('dist/server/index.mjs', "export { default } from './entry.mjs';\n");
