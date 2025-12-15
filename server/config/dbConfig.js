import mysql from "mysql2/promise";
// using pool conneciton so that many conneciton at a time 
const Db  = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password : env.DB_PASSWORD,
    database: env.DB_DATABASE,
    port: env.DB_PORT || 3306,

//  if pool is busy req will be in queue
  waitForConnections: true,
//   limited connection oflimit 10
  connectionLimit: 10,
//   unlimited req can wait in the queue
  queueLimit: 0,
    
});

export default Db;
