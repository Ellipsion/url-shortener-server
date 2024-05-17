import express from "express";
import { login, logout, registerUser, verify } from "../controllers/user";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/verify", verifyToken, verify);
router.post("/logout", logout);

export default router;
