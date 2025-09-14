// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

export async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ MySQL Connected");
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("DB not connected");
  return db;
}
