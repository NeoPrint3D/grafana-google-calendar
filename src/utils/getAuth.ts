import { OAuth2Client } from "google-auth-library";
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error("Missing environment variables");
}

export const getAuthClient = async () => {
  const auth = new OAuth2Client(clientId, clientSecret, redirectUri);
  // see if oauth.json exists and if so use it to authenticate
  try {
    const tokens = JSON.parse(await Bun.file("src/data/oauth.json").text());
    if (tokens) auth.setCredentials(tokens);
  } catch (error) {
    console.error("Error reading oauth.json:", error);
  }
  return auth;
};
