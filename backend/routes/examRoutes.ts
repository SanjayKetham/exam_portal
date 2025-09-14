import { Router } from "express";
import { createExam, getExams, getExamById, updateExam, deleteExam } from "../controllers/examController";

const router = Router();

router.post("/", createExam);
router.get("/", getExams);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
