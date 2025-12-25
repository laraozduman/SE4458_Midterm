import { Router } from "express";
import axios from "axios";

const router = Router();

const BACKEND_URL =
  "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net";

router.get("/query", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/query`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.get("/detailed", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/detailed`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.post("/pay", async (req, res) => {
  const response = await axios.post(`${BACKEND_URL}/pay`, req.body, {
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

router.get("/bankingQuery", async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/bankingQuery`, {
    params: req.query,
    headers: req.headers,
  });
  res.status(response.status).json(response.data);
});

export default router;
