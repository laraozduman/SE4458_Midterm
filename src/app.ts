import express from "express";
import cors from "cors";
import routes from "./router/routes";
import { setupSwagger } from "./config/swagger";
import { logMiddleware } from "./middleware/logMiddleware";

const app = express();
app.use(cors());
app.use(logMiddleware);
app.use(express.json());
app.use("/api/v1", routes);
setupSwagger(app);

export default app;
