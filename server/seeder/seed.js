import mysql from "mysql2/promise";
import { env } from "../config/dotenv.js";
import { seedDoctors } from "./doctor.seed.js";
import { seedPatients } from "./patient.seed.js";

export const pool = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




async function main() {
  try {
    console.log("Seeding started...");
    await seedPatients();
     await seedDoctors();
    console.log("Seeding completed.");

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
