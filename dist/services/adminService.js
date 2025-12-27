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
exports.getBillsStore = getBillsStore;
exports.addBill = addBill;
const billStore_1 = require("../store/billStore");
function getBillsStore() {
    return billStore_1.bills;
}
function addBill(bill) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = billStore_1.bills.find((b) => b.subscriberNo === bill.subscriberNo && b.month === bill.month);
        if (exists) {
            return {
                error: `A bill already exists for ${bill.subscriberNo} in ${bill.month}`,
            };
        }
        bill.paidAmount = 0;
        bill.paidStatus = false;
        bill.details = Array.isArray(bill.details) ? bill.details : [];
        billStore_1.bills.push(bill);
        return { bill };
    });
}
