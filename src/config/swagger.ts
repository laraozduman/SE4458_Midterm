import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

export function setupSwagger(app) {
  const swaggerDocument = yaml.load(path.join(process.cwd(), "openapi.yaml"));

  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
