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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
const BACKEND_URL = "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net";
router.post("/bill", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${BACKEND_URL}/api/v1/admin/bill`, req.body, { headers: req.headers });
    res.status(response.status).json(response.data);
}));
router.post("/bill/batch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${BACKEND_URL}/api/v1/admin/bill/batch`, req.body, { headers: req.headers });
    res.status(response.status).json(response.data);
}));
exports.default = router;
