import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { environment } from "./config/environment.js";

app.listen(environment.PORT, () => {
  console.info(`Patisserie Café API is listening on port ${environment.PORT}.`);
});

void connectDatabase()
  .then(() => console.info("Database connection is ready."))
  .catch(() => console.error("Database connection failed; database-backed API features are unavailable."));
