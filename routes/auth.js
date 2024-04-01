import express from "express";
import { login, register } from "../controllers/auth.js";

// Initialize router
export const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);
