import { Router } from "express";
import axios from "axios";

const router = Router();
const BACKEND_URL =
  "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net";

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/admin/login`,
    req.body
  );
  res.status(response.status).json(response.data);
});

// USER LOGIN
router.post("/user/login", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/user/login`,
    req.body
  );
  res.status(response.status).json(response.data);
});

export default router;
