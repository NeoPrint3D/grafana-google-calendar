import { Hono } from "hono";
import { getCalendar } from "../utils/getCalendar";
import { calendar_v3 } from "googleapis";

export const grafanaRouter = new Hono();

interface CalendarPluginSchema {
  title: string;
  start: string;
  description: string;
  end: string;
  location: string;
  color: number;
}

// Extracted function for listing events
async function listEvents(calendar: calendar_v3.Calendar, calendarId: string) {
  try {
    const { data } = await calendar.events.list({
      calendarId,
      timeMin: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(),
      timeMax: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
      maxResults: 2500,
    });
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching events for calendar ${calendarId}:`, error);
    return [];
  }
}

// Color generation with named constants for clarity
const COLORS = {
  EVEN_DAY: 0,
  DIVISIBLE_BY_3: 1,
  DIVISIBLE_BY_5: 2,
  DIVISIBLE_BY_7: 3,
  DIVISIBLE_BY_10: 4,
  DEFAULT: 5,
};

function generateColor(dateString: string) {
  const day = new Date(dateString).getDate();
  if (day % 2 === 0) return COLORS.EVEN_DAY;
  if (day % 3 === 0) return COLORS.DIVISIBLE_BY_3;
  if (day % 5 === 0) return COLORS.DIVISIBLE_BY_5;
  if (day % 7 === 0) return COLORS.DIVISIBLE_BY_7;
  if (day % 10 === 0) return COLORS.DIVISIBLE_BY_10;
  return COLORS.DEFAULT;
}

// Transform event data to required format
function transformEventData(
  events: calendar_v3.Schema$Event[]
): CalendarPluginSchema[] {
  return events
    .map((event) => ({
      title: event.summary || "",
      start: event.start?.dateTime || "",
      description: event.description || "",
      end: event.end?.dateTime || "",
      location: event.location || "",
      color: generateColor(event.start?.dateTime || ""),
    }))
    .filter((event) => event.start && event.end);
}

grafanaRouter.get("/", async (c) => {
  return c.text("Hello from Grafana plugin!", 200);
});
grafanaRouter.post("/", async (c) => {
  const { calendarId } = await c.req.json();
  const calendar = await getCalendar();
  if (!calendar) {
    return c.text("Not authenticated", 401);
  }

  let totalEvents = [];
  if (Array.isArray(calendarId)) {
    const eventsPromises = calendarId.map((id) => listEvents(calendar, id));
    const eventsArrays = await Promise.all(eventsPromises);
    totalEvents = eventsArrays.flat();
  } else {
    totalEvents = await listEvents(calendar, calendarId);
  }
  console.info(
    `Fetched ${totalEvents.length} events for calendar ${calendarId}`
  );

  return c.json({ data: transformEventData(totalEvents) });
});
