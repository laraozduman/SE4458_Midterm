"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid authorization format" });
        }
        const token = header.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
