import mongoose from "mongoose";
import { MAX_DATABASE_POOL_SIZE } from "./constants.js";
import { environment } from "./environment.js";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(environment.MONGODB_URI, {
    maxPoolSize: MAX_DATABASE_POOL_SIZE,
    serverSelectionTimeoutMS: 5_000,
  });
}
