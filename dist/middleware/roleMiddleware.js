"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin privilege required" });
    }
    next();
}
