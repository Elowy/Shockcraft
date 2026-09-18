if(!process.env.MYSQL_URL)throw Error('MYSQL_URL is required for the Node.js server.');
if(!process.env.APP_ORIGIN)throw Error('APP_ORIGIN must contain the public HTTPS origin.');
const origin=new URL(process.env.APP_ORIGIN);
if(origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password)throw Error('APP_ORIGIN must be an origin only.');
if(origin.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(origin.hostname))throw Error('APP_ORIGIN must use HTTPS outside local development.');
process.env.HOST||='127.0.0.1';
process.env.PORT||='3000';
process.env.NODE_ENV='production';
await import('../dist/standalone/server.js');
