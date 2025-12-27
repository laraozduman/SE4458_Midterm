"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBill = queryBill;
exports.queryBillDetailed = queryBillDetailed;
exports.payBill = payBill;
exports.bankingQueryBill = bankingQueryBill;
exports.createBill = createBill;
const billService = __importStar(require("../services/billService"));
function queryBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { subscriberNo, month } = req.query;
            if (!subscriberNo || !month) {
                return res
                    .status(400)
                    .json({ message: "subscriberNo and month are required" });
            }
            const bill = yield billService.getBill(subscriberNo, month);
            if (!bill)
                return res.status(404).json({ message: "Bill not found" });
            return res.status(200).json(bill);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function queryBillDetailed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { subscriberNo, month } = req.query;
            if (!subscriberNo || !month) {
                return res
                    .status(400)
                    .json({ message: "subscriberNo and month are required" });
            }
            const bill = yield billService.getBillDetailed(subscriberNo, month);
            if (!bill)
                return res.status(404).json({ message: "Bill not found" });
            const page = parseInt(req.query.page || "1", 10);
            const limit = parseInt(req.query.limit || "10", 10);
            const start = (page - 1) * limit;
            const end = start + limit;
            const totalItems = bill.details.length;
            const paginatedDetails = bill.details.slice(start, end);
            return res.status(200).json({
                subscriberNo: bill.subscriberNo,
                month: bill.month,
                billTotal: bill.billTotal,
                paidAmount: bill.paidAmount,
                paidStatus: bill.paidStatus,
                totalDetails: totalItems,
                page,
                limit,
                details: paginatedDetails,
            });
        }
        catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal server error", error: err });
        }
    });
}
function payBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { subscriberNo, month, amount } = req.body;
            if (!subscriberNo || !month || amount === undefined) {
                return res.status(400).json({
                    message: "subscriberNo, month and amount are required",
                });
            }
            const { bill, error } = yield billService.payBill(subscriberNo, month, Number(amount));
            if (!bill) {
                return res.status(404).json({ message: "Bill not found" });
            }
            if (error) {
                return res.status(400).json({ message: error });
            }
            return res.status(200).json({
                message: "Payment processed",
                bill: bill,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function bankingQueryBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const subscriberNo = req.query.subscriberNo;
            if (!subscriberNo) {
                return res.status(400).json({ message: "subscriberNo is required" });
            }
            if (user.role !== "admin" && user.subscriberNo !== subscriberNo) {
                return res.status(403).json({
                    message: "You are not allowed to view another subscriber's bills",
                });
            }
            const bills = yield billService.getBillsBySubscriber(subscriberNo);
            if (bills.length === 0) {
                return res.status(200).json({ message: "No unpaid bills found" });
            }
            return res.status(200).json(bills);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function createBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const billData = req.body;
            if (!billData.subscriberNo ||
                !billData.month ||
                billData.billTotal === undefined ||
                billData.paidAmount === undefined) {
                return res.status(400).json({
                    message: "subscriberNo, month, billTotal and paidAmount are required",
                });
            }
            const newBill = yield billService.createBill(billData);
            if (!newBill) {
                return res
                    .status(409)
                    .json({ message: "Bill for this subscriber and month already exists" });
            }
            return res.status(201).json(newBill);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
