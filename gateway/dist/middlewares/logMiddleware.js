"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMiddleware = logMiddleware;
function logMiddleware(req, res, next) {
    const startTime = Date.now();
    const method = req.method;
    const path = req.originalUrl;
    const ip = req.ip;
    const headers = req.headers;
    const requestSize = Buffer.byteLength(JSON.stringify(req.body || {}));
    let authStatus = "none";
    if (req.user) {
        authStatus = "success";
    }
    else if (req.headers.authorization) {
        authStatus = "failed";
    }
    res.on("finish", () => {
        const latency = Date.now() - startTime;
        const status = res.statusCode;
        const responseSize = Number(res.getHeader("Content-Length")) || 0;
        console.log("\n===== REQUEST LOG =====");
        console.log(`Timestamp      : ${new Date().toISOString()}`);
        console.log(`Method         : ${method}`);
        console.log(`Path           : ${path}`);
        console.log(`IP             : ${ip}`);
        console.log(`Headers        : ${JSON.stringify(headers)}`);
        console.log(`Request Size   : ${requestSize} bytes`);
        console.log(`Auth Status    : ${authStatus}`);
        console.log("----- RESPONSE LOG -----");
        console.log(`Status Code    : ${status}`);
        console.log(`Latency        : ${latency} ms`);
        console.log(`Response Size  : ${responseSize} bytes`);
        console.log("===========================\n");
    });
    next();
}
