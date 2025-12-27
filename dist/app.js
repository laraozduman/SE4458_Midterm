"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const billRouter_1 = __importDefault(require("./router/billRouter"));
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/bills", billRouter_1.default);
app.use("/api/v1/admin", adminRouter_1.default);
exports.default = app;
