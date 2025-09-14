import { Request, Response } from "express";
import pool from "../config/db";

// ✅ Create a new exam
export const createExam = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, category, startDate, endDate, passingScore, maxAttempts, status, questions } =
      req.body;

    const [result] = await pool.execute(
      `INSERT INTO exams 
      (title, description, duration, category, start_date, end_date, passing_score, max_attempts, status, questions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, duration, category, startDate, endDate, passingScore, maxAttempts, status, questions]
    );

    res.status(201).json({ message: "Exam created successfully", examId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all exams
export const getExams = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get exam by ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.execute("SELECT * FROM exams WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update exam
export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, duration, category, startDate, endDate, passingScore, maxAttempts, status, questions } =
      req.body;

    await pool.execute(
      `UPDATE exams 
       SET title=?, description=?, duration=?, category=?, start_date=?, end_date=?, passing_score=?, max_attempts=?, status=?, questions=? 
       WHERE id=?`,
      [title, description, duration, category, startDate, endDate, passingScore, maxAttempts, status, questions, id]
    );

    res.json({ message: "Exam updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete exam
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM exams WHERE id = ?", [id]);
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
