import { Router } from "express";
import multer from "multer";
import { addBill } from "../controller/adminController";
import { addBillBatch } from "../controller/adminController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import { adminLogin, userLogin } from "../controller/loginController";
import {
  queryBill,
  queryBillDetailed,
  payBill,
  bankingQueryBill,
} from "../controller/billController";
import { rateLimit } from "../middleware/rateLimit";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/admin/bill", authMiddleware, requireAdmin, addBill);
router.post(
  "/admin/bill/batch",
  authMiddleware,
  requireAdmin,
  upload.single("file"),
  addBillBatch
);
router.post("/auth/admin/login", adminLogin);
router.post("/auth/user/login", userLogin);
router.get("/bills/query", authMiddleware, rateLimit, queryBill);
router.get("/bills/detailed", authMiddleware, queryBillDetailed);
router.post("/bills/pay", payBill);
router.get("/bills/bankingQuery", authMiddleware, bankingQueryBill);
export default router;
