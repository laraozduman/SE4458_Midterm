"use strict";
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
exports.getBill = getBill;
exports.getBillsBySubscriber = getBillsBySubscriber;
exports.createBill = createBill;
exports.getBillDetailed = getBillDetailed;
exports.payBill = payBill;
const billStore_1 = require("../store/billStore");
function getBill(subscriberNo, month) {
    return __awaiter(this, void 0, void 0, function* () {
        return (billStore_1.bills.find((b) => b.subscriberNo === subscriberNo && b.month === month) ||
            null);
    });
}
function getBillsBySubscriber(subscriberNo) {
    return __awaiter(this, void 0, void 0, function* () {
        return billStore_1.bills.filter((b) => b.subscriberNo === subscriberNo && !b.paidStatus);
    });
}
function createBill(bill) {
    return __awaiter(this, void 0, void 0, function* () {
        if (billStore_1.bills.find((b) => b.subscriberNo === bill.subscriberNo && b.month === bill.month)) {
            return null;
        }
        bill.paidStatus = false;
        bill.details = Array.isArray(bill.details) ? bill.details : [];
        bill.paidAmount = 0;
        billStore_1.bills.push(bill);
        return bill;
    });
}
function getBillDetailed(subscriberNo, month) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching detailed bill for:", subscriberNo, month);
        return (billStore_1.bills.find((b) => b.subscriberNo === subscriberNo && b.month === month) ||
            null);
    });
}
function payBill(subscriberNo, month, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const bill = billStore_1.bills.find((b) => b.subscriberNo === subscriberNo && b.month === month);
        if (!bill)
            return { bill: null, error: "Bill not found" };
        const remainingAmount = bill.billTotal - bill.paidAmount;
        if (amount > remainingAmount) {
            console.error(`Payment amount exceeds remaining bill amount. Remaining: ${remainingAmount}, Attempted payment: ${amount}`);
            return {
                bill: bill,
                error: `Amount exceeds remaining balance. Remaining: ${remainingAmount}`,
            };
        }
        bill.paidAmount += amount;
        if (bill.paidAmount == bill.billTotal) {
            bill.paidStatus = true;
        }
        return { bill };
    });
}
