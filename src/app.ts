import express from "express";
import cors from "cors";
import authRoutes from "./router/authRouter";
import billRoutes from "./router/billRouter";
import adminRoutes from "./router/adminRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/admin", adminRoutes);

export default app;
