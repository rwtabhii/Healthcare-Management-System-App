// import mysql from "mysql2/promise";
// // using pool conneciton so that many conneciton at a time 
// const Db  = await mysql.createConnection({
//     host: env.DB_HOST,
//     user: env.DB_USER,
//     password : env.DB_PASSWORD,
//     database: env.DB_DATABASE,
//     port: env.DB_PORT || 3306,

// //  if pool is busy req will be in queue
//   waitForConnections: true,
// //   limited connection oflimit 10
//   connectionLimit: 10,
// //   unlimited req can wait in the queue
//   queueLimit: 0,
    
// });

// export default Db;

import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {PrismaClient} from "../generated/prisma/client.ts"

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });

export { prisma }
