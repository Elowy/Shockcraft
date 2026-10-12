import {fileURLToPath} from 'node:url';
import {runBuildGuard} from './build-guard.mjs';
// Éles build előtt a Tudástár kapujának és a lektori csomagnak naprakésznek kell lennie (scripts/build-guard.mjs).
runBuildGuard();
process.env.SHOCKCRAFT_TARGET='node';
const cli=new URL('../node_modules/vinext/dist/cli.js',import.meta.url);
process.argv=[process.execPath,fileURLToPath(cli),'build'];
await import(cli.href);
