import { Router } from "express";
import {
  queryBill,
  queryBillDetailed,
  payBill,
  createBill,
} from "../controller/billController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/query", authMiddleware, queryBill);
router.get("/detailed", authMiddleware, queryBillDetailed);
router.post("/pay", payBill);
router.post("/createBill", authMiddleware, createBill);

export default router;
