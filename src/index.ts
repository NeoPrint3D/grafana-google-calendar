import { Hono } from "hono";
import { oauthRouter } from "./routes/google";
import { grafanaRouter } from "./routes/grafana";
import { getAuthClient } from "./utils/getAuth";

// Configure OAuth2 client with your Google project credentials

// Initialize Hono app
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, world!", 200);
});

app.get("/expiration", async (c) => {
  const authClient = await getAuthClient();
  if (!authClient.credentials.expiry_date) {
    return c.text("Auth is broken", 500);
  }
  return c.text(
    `${Intl.DateTimeFormat().format(authClient.credentials.expiry_date)}`,
    200
  );
});
app.route("/auth/google", oauthRouter);
app.route("/grafana", grafanaRouter);

export default {
  port: 9154,
  fetch: app.fetch,
};
