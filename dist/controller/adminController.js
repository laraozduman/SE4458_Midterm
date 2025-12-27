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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBill = addBill;
exports.addBillBatch = addBillBatch;
const adminService = __importStar(require("../services/adminService"));
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
function addBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const billData = req.body;
            if (!billData.subscriberNo ||
                !billData.month ||
                billData.billTotal === undefined) {
                return res.status(400).json({
                    message: "subscriberNo, month, billTotal are required",
                });
            }
            const { bill, error } = yield adminService.addBill(billData);
            if (error) {
                return res.status(400).json({ message: error });
            }
            return res.status(201).json({
                message: "Bill created",
                bill,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function addBillBatch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "CSV file is required" });
            }
            const filePath = req.file.path;
            const rows = [];
            const errors = [];
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parse_1.parse)({ columns: true, trim: true }))
                .on("data", (row) => {
                rows.push(row);
            })
                .on("end", () => __awaiter(this, void 0, void 0, function* () {
                fs_1.default.unlinkSync(filePath);
                let created = 0;
                for (const row of rows) {
                    const { subscriberNo, month, billTotal } = row;
                    if (!subscriberNo || !month || !billTotal) {
                        errors.push(`Missing required fields in row: ${JSON.stringify(row)}`);
                        continue;
                    }
                    const { bill, error } = yield adminService.addBill({
                        subscriberNo,
                        month,
                        billTotal: Number(billTotal),
                        paidAmount: 0,
                        paidStatus: false,
                        details: [],
                    });
                    if (error) {
                        errors.push(error);
                    }
                    else {
                        created++;
                    }
                }
                return res.status(200).json({
                    created,
                    rows,
                    errors,
                });
            }))
                .on("error", (error) => {
                console.error(error);
                return res.status(500).json({ message: "Error reading CSV file" });
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
