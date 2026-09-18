import {fileURLToPath} from 'node:url';
process.env.SHOCKCRAFT_TARGET='node';
const cli=new URL('../node_modules/vinext/dist/cli.js',import.meta.url);
process.argv=[process.execPath,fileURLToPath(cli),'build'];
await import(cli.href);
