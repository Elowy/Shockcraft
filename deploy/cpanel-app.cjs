'use strict';
// Passenger/cPanel-indító. A GitHub-workflow app.cjs néven teszi az alkalmazás könyvtárának
// gyökerébe; a cPanel „Setup Node.js App” felületén az „Application startup file” mezőbe
// ezt kell írni: app.cjs. A Passenger require()-rel tölt, ezért CommonJS, és dinamikus
// importtal indítja az ESM-szervert.
//
// 1. Ha az alkalmazás könyvtárában van .env.production, beolvassa. A kezelőfelületen
//    megadott környezeti változók elsőbbséget élveznek a fájlbelivel szemben.
// 2. Az indítás menetét és hibáit a logs/inditas.log fájlba is írja (titkok nélkül), hogy a
//    „Web application could not be started” hiba oka a Passenger-napló nélkül is látsszon.
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS: a Passenger require()-rel tölti be */
const fs = require('node:fs');
const path = require('node:path');

const ENV_FILE = path.join(__dirname, '.env.production');
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'inditas.log');
const LOG_MAX = 1024 * 1024;
const STARTUP_WINDOW = 120_000;
const SECRETS = ['MYSQL_URL', 'BILLING_ENCRYPTION_KEY', 'SESSION_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY'];

function redact(text) {
  let out = String(text);
  for (const key of SECRETS) {
    const value = process.env[key];
    if (value && value.length >= 6) out = out.split(value).join(`<${key}>`);
  }
  // URL-be írt felhasználó:jelszó (pl. egy kódolatlan MYSQL_URL darabja).
  return out.replace(/([a-z][a-z0-9+.-]*:\/\/)[^\s'"/]*@/gi, '$1***@');
}

function writeLog(text) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true, mode: 0o700 });
    let size = 0;
    try { size = fs.statSync(LOG_FILE).size; } catch {}
    if (size > LOG_MAX) fs.renameSync(LOG_FILE, `${LOG_FILE}.1`);
    fs.appendFileSync(LOG_FILE, text, { mode: 0o600 });
  } catch {}
}

function log(message) {
  const line = `[${new Date().toISOString()}] ${redact(message)}\n`;
  writeLog(line);
  process.stderr.write(line);
}

// Az env-fájl beolvasása; a változók eredete a naplóba kerül (az értékük nem).
const before = new Set(Object.keys(process.env));
let envNote = 'nincs .env.production (csak a kezelőfelület változói)';
if (fs.existsSync(ENV_FILE)) {
  try {
    process.loadEnvFile(ENV_FILE);
    envNote = '.env.production beolvasva';
    const mode = fs.statSync(ENV_FILE).mode & 0o777;
    if (mode & 0o077) envNote += ` – FIGYELEM: a jogosultsága ${mode.toString(8)}, legyen 600 (chmod 600 .env.production)`;
  } catch (e) {
    envNote = `.env.production nem olvasható: ${e && e.message}`;
  }
}

function source(key) {
  if (!process.env[key]) return 'HIÁNYZIK';
  return before.has(key) ? 'kezelőfelület' : '.env.production';
}

let mysqlNote = source('MYSQL_URL');
if (process.env.MYSQL_URL) {
  try { new URL(process.env.MYSQL_URL); mysqlNote += ', érvényes URL'; }
  catch { mysqlNote += ', ÉRVÉNYTELEN URL – a jelszó speciális karaktereit URL-kódolni kell'; }
}

log(`Indítás: Node ${process.version}, könyvtár ${__dirname}, Passenger: ${typeof PhusionPassenger !== 'undefined' ? 'igen' : 'nem'}; ${envNote}`);
log(`APP_ORIGIN: ${source('APP_ORIGIN')}${process.env.APP_ORIGIN ? ` (${process.env.APP_ORIGIN})` : ''}; MYSQL_URL: ${mysqlNote}; NODE_ENV: ${process.env.NODE_ENV || '–'}`);

// Az indulás első két percében a konzolkimenetet is naplózza (a szerver indulási üzenete
// vagy a hibája), utána már csak a Passenger-napló kapja.
const original = { log: console.log, error: console.error };
let capturing = true;
for (const name of ['log', 'error']) {
  console[name] = (...args) => {
    original[name](...args);
    if (capturing) writeLog(`[${new Date().toISOString()}] ${redact(args.map((a) => (a instanceof Error ? a.stack : String(a))).join(' '))}\n`);
  };
}
function fatal(kind, e) {
  log(`${kind}: ${e && e.stack ? e.stack : e}`);
  process.exit(1);
}
const onException = (e) => fatal('Kezeletlen kivétel', e);
const onRejection = (e) => fatal('Kezeletlen elutasítás', e);
process.on('uncaughtException', onException);
process.on('unhandledRejection', onRejection);
process.on('exit', (code) => { if (code) log(`A folyamat ${code} kóddal leállt.`); });
setTimeout(() => {
  capturing = false;
  console.log = original.log;
  console.error = original.error;
  process.off('uncaughtException', onException);
  process.off('unhandledRejection', onRejection);
}, STARTUP_WINDOW).unref();

import('./scripts/start-node.mjs').catch((e) => fatal('Az indítás sikertelen', e));
