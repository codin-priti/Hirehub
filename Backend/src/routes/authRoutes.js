import express from "express";

import { register } from "../controller/authController.js";
import {
    forgotPassword,
    resetPassword,
} from "../controller/forgotpasswordController.js";
import { login, logout } from "../controller/loginController.js";

import authmiddleware from "../middleware/authMiddleware.js";
import validateRegistration from "../middleware/validateRegistration.js";

const router = express.Router();

// Register a new user
router.post("/register", validateRegistration, register);

// Login
router.post("/login", login);

// Logout (authenticated users only)
router.post("/logout", authmiddleware, logout);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

export default router;

