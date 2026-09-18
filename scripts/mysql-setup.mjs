import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import {mysqlOptions} from '../db/mysql-config.ts';
if(!process.env.MYSQL_URL)throw Error('Set MYSQL_URL in a server-side environment file first.');
const db=await mysql.createConnection(mysqlOptions(process.env.MYSQL_URL,process.env.MYSQL_SSL_CA));
try{
  const source=await fs.readFile(new URL('../db/mysql-schema.sql',import.meta.url),'utf8');
  for(const statement of source.replace(/^--.*$/gm,'').split(';').map(v=>v.trim()).filter(Boolean))await db.execute(statement);
  for(const query of ['SELECT id,email,name,password_hash,created_at FROM users LIMIT 0','SELECT token_hash,user_id,expires_at,created_at FROM sessions LIMIT 0','SELECT `key`,attempts,expires_at FROM auth_limits LIMIT 0','SELECT id,data,revision,updated_at FROM plans LIMIT 0'])await db.execute(query);
  console.log('ShockCraft MySQL schema is ready. No existing data was deleted.');
}finally{await db.end()}
