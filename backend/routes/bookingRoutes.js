import express from "express";
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelMyBooking,} from "../controllers/bookingController.js";
import {authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.put("/:id/cancel", authMiddleware, cancelMyBooking);

router.get("/", authMiddleware, adminOnly, getAllBookings);
router.put("/:id/status", authMiddleware, adminOnly, updateBookingStatus);

export default router;
