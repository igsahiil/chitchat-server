import authController from "../controllers/auth/Auth.js";
import { Router } from "express";

const router = Router();

const { Login , Register } = authController;

router.post("/login", Login)
router.post("/register", Register)

export default router;