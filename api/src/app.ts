import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

export const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);
