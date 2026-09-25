import express from "express";
import { getServices, getServiceById, createService, updateService, deleteService,} from "../controllers/serviceController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", authMiddleware, adminOnly, createService);
router.put("/:id",authMiddleware, adminOnly, updateService);
router.delete("/:id", authMiddleware, adminOnly, deleteService);

export default router;
