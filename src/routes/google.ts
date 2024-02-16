import { Hono } from "hono";
import { getAuthClient } from "../utils/getAuth";
export const oauthRouter = new Hono();

// Route to start the OAuth flow
oauthRouter.get("/", async (c) => {
  const authClient = await getAuthClient();
  const url = authClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/tasks",
    ],
  });
  return c.redirect(url);
});

// Route to handle OAuth callback
oauthRouter.get("/callback", async (c) => {
  const authClient = await getAuthClient();
  const code = c.req.query("code");
  if (!code) {
    return c.text("Authorization code not found", 400);
  }

  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);

  Bun.write("src/data/oauth.json", JSON.stringify(tokens, null, 2));
  return c.redirect("/");
});
