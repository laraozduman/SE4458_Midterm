"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = adminLogin;
exports.userLogin = userLogin;
const authService_1 = require("../services/authService");
function adminLogin(req, res) {
    const { username, password } = req.body;
    console.log(username, password);
    if (username === "admin" && password === "1234") {
        const token = (0, authService_1.generateToken)({ role: "admin", username });
        return res.status(200).json({ token });
    }
    return res.status(401).json({ message: "Invalid admin credentials" });
}
function userLogin(req, res) {
    const { subscriberNo } = req.body;
    if (!subscriberNo) {
        return res.status(400).json({ message: "subscriberNo required" });
    }
    const token = (0, authService_1.generateToken)({ role: "user", subscriberNo });
    return res.status(200).json({ token });
}
