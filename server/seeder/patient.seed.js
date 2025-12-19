import { pool } from "./seed.js";

const dummyPatients = [
  { username: "User1", email: "user1@test.com", password: "user123", mobile: "9876543210" },
  { username: "User2", email: "user2@test.com", password: "user123", mobile: "9876543211" },
  { username: "User3", email: "user3@test.com", password: "user123", mobile: "9876543212" },
  { username: "User4", email: "user4@test.com", password: "user123", mobile: "9876543213" },
  { username: "User5", email: "user5@test.com", password: "user123", mobile: "9876543214" }
];

export async function seedPatients() {
  const conn = await pool.getConnection();
  try {
    console.log("Seeding patients...");

    // Delete only patients
    await conn.query(`DELETE FROM user WHERE role = 'PATIENT'`);

    // Insert patients
    for (const p of dummyPatients) {
      await conn.query(
        `INSERT INTO user (username, email, password, mobile, role,updatedAt) VALUES (?, ?, ?, ?, 'PATIENT',NOW())`,
        [p.username, p.email, p.password, p.mobile]
      );
    }

    console.log("Patients seeded.");
  } finally {
    conn.release();
  }
}
