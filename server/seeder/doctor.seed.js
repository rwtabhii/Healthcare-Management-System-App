import { pool } from "./seed.js";

const dummyDoctors = [
  { username: "dr_amit", email: "amit@hospital.com", password: "doctor123", mobile: "9876543201" },
  { username: "dr_neha", email: "neha@hospital.com", password: "doctor123", mobile: "9876543202" },
  { username: "dr_rahul", email: "rahul@hospital.com", password: "doctor123", mobile: "9876543203" },
  { username: "dr_priya", email: "priya@hospital.com", password: "doctor123", mobile: "9876543204" },
  { username: "dr_ankit", email: "ankit@hospital.com", password: "doctor123", mobile: "9876543205" },
  { username: "dr_kavita", email: "kavita@hospital.com", password: "doctor123", mobile: "9876543206"},
  { username: "dr_suresh", email: "suresh@hospital.com", password: "doctor123", mobile: "9876543207"},
  { username: "dr_ritu", email: "ritu@hospital.com", password: "doctor123", mobile: "9876543208"},
  { username: "dr_vikram", email: "vikram@hospital.com", password: "doctor123", mobile: "9876543209"},
  { username: "dr_pooja", email: "pooja@hospital.com", password: "doctor123", mobile: "9876543210"}
];

export async function seedDoctors() {
  const conn = await pool.getConnection();
  try {
    console.log("Seeding doctors...");

    // Delete only doctors
    await conn.query(`DELETE FROM user WHERE role = 'DOCTOR'`);

    // Insert doctors
    for (const d of dummyDoctors) {
      await conn.query(
        `INSERT INTO user (username, email, password, mobile, role,updatedAt) VALUES (?, ?, ?, ?, 'DOCTOR',NOW())`,
        [d.username, d.email, d.password, d.mobile]
      );
    }

    console.log("Doctors seeded.");
  } finally {
    conn.release();
  }
}
