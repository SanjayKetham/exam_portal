import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true, // ✅ allow cookies to be sent
}));
app.use(express.json());

// Routes
app.use("/api", authRoutes);
// server.js
app.post('/api/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0), // immediately expire
  });
  res.json({ message: 'Logged out successfully' });
});


// Start server after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
