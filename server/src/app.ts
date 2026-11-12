import cors from "cors";
import express from "express";
import helmet from "helmet";
import { API_PREFIX } from "./config/constants.js";
import { environment } from "./config/environment.js";
import { authenticate } from "./middleware/authenticate.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { authRoutes } from "./routes/authRoutes.js";
import { cateringRoutes } from "./routes/cateringRoutes.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { paymentRoutes } from "./routes/paymentRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: environment.CLIENT_ORIGIN, credentials: false }));
app.use(express.json({ limit: "16kb" }));

app.use(API_PREFIX, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/catering`, cateringRoutes);
app.use(`${API_PREFIX}/users`, authenticate, userRoutes);
app.use(`${API_PREFIX}/orders`, authenticate, orderRoutes);
app.use(`${API_PREFIX}/payments`, authenticate, paymentRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
