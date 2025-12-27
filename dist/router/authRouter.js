"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controller/loginController");
const router = (0, express_1.Router)();
router.post("/admin/login", loginController_1.adminLogin);
router.post("/user/login", loginController_1.userLogin);
exports.default = router;
