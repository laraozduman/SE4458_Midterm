import { Router } from "express";
import multer from "multer";
import { addBill } from "../controller/adminController";
import { addBillBatch } from "../controller/adminController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/bill", authMiddleware, requireAdmin, addBill);
router.post(
  "/bill/batch",
  authMiddleware,
  requireAdmin,
  upload.single("file"),
  addBillBatch
);

export default router;
