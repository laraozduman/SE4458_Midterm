"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const adminController_1 = require("../controller/adminController");
const adminController_2 = require("../controller/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
router.post("/bill", authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdmin, adminController_1.addBill);
router.post("/bill/batch", authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdmin, upload.single("file"), adminController_2.addBillBatch);
exports.default = router;
