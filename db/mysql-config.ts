import type {ConnectionOptions} from 'mysql2/promise';
export function mysqlOptions(value:string,ca?:string):ConnectionOptions{
  const url=new URL(value);
  if(url.protocol!=='mysql:'||!url.hostname||!url.username||url.pathname.length<2)throw Error('MYSQL_URL must name a MySQL database');
  if(url.search)throw Error('Use MYSQL_SSL_CA for TLS configuration; URL query options are not supported');
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  return {host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),database:decodeURIComponent(url.pathname.slice(1)),charset:'utf8mb4',connectTimeout:10000,multipleStatements:false,disableEval:true,ssl:local&&!ca?undefined:{rejectUnauthorized:true,...(ca?{ca}:{})}};
}
