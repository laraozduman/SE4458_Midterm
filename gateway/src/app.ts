import express from "express";
import cors from "cors";

import billRoutes from "./routes/bill-routes";
import authRoutes from "./routes/auth-routes";
import adminRoutes from "./routes/admin-routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/bill", billRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);

export default app;
