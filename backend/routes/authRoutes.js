import express from "express";
import { register, login, getUserSettings, updateUserSettings} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/settings/:userId', getUserSettings);
router.put('/settings/:userId', updateUserSettings);
// router.get("/debug-admin", debugAdmin);
// router.post("/reset-admin-password", resetAdminPassword);

export default router;
