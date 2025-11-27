import { Router } from "express";
import {
  queryBill,
  queryBillDetailed,
  payBill,
  createBill,
  bankingQueryBill,
} from "../controller/billController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/query", authMiddleware, queryBill);
router.get("/detailed", authMiddleware, queryBillDetailed);
router.post("/pay", payBill);
router.post("/createBill", authMiddleware, createBill);
router.get("/bankingQuery", authMiddleware, bankingQueryBill);

export default router;
