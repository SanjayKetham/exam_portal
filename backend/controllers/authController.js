import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

export async function register(req, res) {
  const { full_name, email, password, role } = req.body;
  const db = getDB();

  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, role || "user"]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function login(req, res) {
  const { email, password } = req.body;
  const db = getDB();

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // cookie cannot be accessed by JS
      secure: false,  // true if using HTTPS
      sameSite: "lax", // adjust according to your frontend
      maxAge: 3600000, // 1 hour
    });

    res.json({
      user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      message: "Login successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}