import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, role || "user"]
    );

    return res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", { expiresIn: "1h" });

    res.json({
      user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserSettings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute(
      'SELECT full_name, email, phone, notifications, theme, language FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userSettings = rows[0];
    userSettings.notifications = userSettings.notifications ? JSON.parse(userSettings.notifications) : {};

    res.json(userSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserSettings = async (req, res) => {
  const userId = req.params.userId;
  const { full_name, email, phone, notifications, theme, language } = req.body;

  try {
    const notificationsJson = JSON.stringify(notifications || {});

    await db.execute(
      `UPDATE users SET full_name = ?, email = ?, phone = ?, notifications = ?, theme = ?, language = ? WHERE id = ?`,
      [full_name, email, phone, notificationsJson, theme, language, userId]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Add this route to check the admin user's password hash
// app.get("/api/debug-admin", async (req, res) => {
//   try {
//     const [users] = await db.execute("SELECT * FROM users WHERE email = 'admin@examportal.com'");
//     if (users.length > 0) {
//       const admin = users[0];
//       res.json({
//         id: admin.id,
//         email: admin.email,
//         role: admin.role,
//         full_name: admin.full_name,
//         passwordHash: admin.password, // This will show the stored hash
//         passwordLength: admin.password ? admin.password.length : 0
//       });
//     } else {
//       res.json({ message: "Admin not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Route to reset admin password if needed
// app.post("/api/reset-admin-password", async (req, res) => {
//   const { newPassword } = req.body;
  
//   if (!newPassword) {
//     return res.status(400).json({ error: "New password is required" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
    
//     await db.execute(
//       "UPDATE users SET password = ? WHERE email = 'admin@examportal.com'",
//       [hashedPassword]
//     );

//     res.json({ 
//       message: "Admin password reset successfully",
//       newPassword: newPassword // Remove this in production
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
