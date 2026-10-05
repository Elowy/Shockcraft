import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import {mysqlOptions} from '../db/mysql-config.ts';
if(!process.env.MYSQL_URL)throw Error('Set MYSQL_URL in a server-side environment file first.');
const db=await mysql.createConnection(mysqlOptions(process.env.MYSQL_URL,process.env.MYSQL_SSL_CA));
try{
  const source=await fs.readFile(new URL('../db/mysql-schema.sql',import.meta.url),'utf8');
  for(const statement of source.replace(/^--.*$/gm,'').split(';').map(v=>v.trim()).filter(Boolean))await db.execute(statement);
  // Upgrade existing installations as well as creating fresh databases.
  for(const [table,column,definition] of [['plans','state',"varchar(10) NOT NULL DEFAULT 'active'"],['plans','state_changed_at','varchar(30) NULL'],['billing_orders','kind',"varchar(20) NOT NULL DEFAULT 'project'"],['users','email_verified_at','bigint NULL'],['users','auth_version','int NOT NULL DEFAULT 0'],['sessions','auth_version','int NOT NULL DEFAULT 0']]){
    const [columns]=await db.execute('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',[table,column]);
    if(!columns.length)await db.execute('ALTER TABLE '+table+' ADD COLUMN '+column+' '+definition);
  }
  for(const query of ['SELECT id,email,name,password_hash,created_at,email_verified_at,auth_version FROM users LIMIT 0','SELECT token_hash,user_id,expires_at,created_at,auth_version FROM sessions LIMIT 0','SELECT `key`,attempts,expires_at FROM auth_limits LIMIT 0','SELECT id,data,revision,updated_at FROM plans LIMIT 0'])await db.execute(query);
  console.log('ShockCraft MySQL schema is ready. No existing data was deleted.');
}finally{await db.end()}
