import { Router } from "express";
import axios from "axios";

const router = Router();
const BACKEND_URL =
  "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net/api/v1/bills";

router.post("/bill", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/admin/bill`,
    req.body,
    { headers: req.headers }
  );
  res.status(response.status).json(response.data);
});

router.post("/bill/batch", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/admin/bill/batch`,
    req.body,
    { headers: req.headers }
  );
  res.status(response.status).json(response.data);
});

export default router;
