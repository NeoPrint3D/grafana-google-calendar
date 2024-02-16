import { Credentials } from "google-auth-library";
import { getAuthClient } from "./getAuth";
import { google } from "googleapis";

// see if the user is already authenticated or has the oauth.json file if not redirect to the google oauth flow

export async function getCalendar() {
  const authClient = await getAuthClient();

  const calendar = google.calendar({ version: "v3", auth: authClient });
  return calendar;
}
