"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const requestCounts = {};
function rateLimit(req, res, next) {
    const subscriberNo = req.query.subscriberNo;
    if (!subscriberNo) {
        return res.status(400).json({ message: "subscriberNo is required" });
    }
    const today = new Date().toISOString().split("T")[0];
    const key = `${subscriberNo}-${today}`;
    if (!requestCounts[key]) {
        requestCounts[key] = 1;
    }
    else {
        requestCounts[key] += 1;
    }
    if (requestCounts[key] > 3) {
        return res.status(429).json({
            message: "Daily limit exceeded (3 requests per day)",
        });
    }
    next();
}
