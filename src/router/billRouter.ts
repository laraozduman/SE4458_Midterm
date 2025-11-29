import { Router } from "express";
import {
  queryBill,
  queryBillDetailed,
  payBill,
  createBill,
  bankingQueryBill,
} from "../controller/billController";
import { authMiddleware } from "../middleware/authMiddleware";
import { rateLimit } from "../middleware/rateLimit";

const router = Router();

router.get("/query", authMiddleware, rateLimit, queryBill);
router.get("/detailed", authMiddleware, queryBillDetailed);
router.post("/pay", payBill);
router.post("/createBill", authMiddleware, createBill);
router.get("/bankingQuery", authMiddleware, bankingQueryBill);

export default router;
