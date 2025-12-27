import { Router } from "express";
import axios from "axios";

const router = Router();

const BACKEND_URL =
  "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net";

router.get("/bills/query", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/bills/query`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.get("/bills/detailed", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/bills/detailed`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.post("/bills/pay", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/bills/pay`,
    req.body,
    {
      headers: req.headers,
    }
  );
  res.status(response.status).json(response.data);
});

router.get("/bills/bankingQuery", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/bills/bankingQuery`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.post("/auth/admin/login", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/admin/login`,
    req.body
  );
  res.status(response.status).json(response.data);
});

router.post("/auth/user/login", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/user/login`,
    req.body
  );
  res.status(response.status).json(response.data);
});

router.post("/admin/bill", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/admin/bill`,
    req.body,
    { headers: req.headers }
  );
  res.status(response.status).json(response.data);
});

router.post("/admin/bill/batch", async (req, res) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/admin/bill/batch`,
    req.body,
    { headers: req.headers }
  );
  res.status(response.status).json(response.data);
});

export default router;
