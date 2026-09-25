import express from "express";

import { chatWithAI } from "../controllers/aiController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// AI chatbot - user must be logged in
router.post("/chat", authMiddleware, chatWithAI);

export default router;