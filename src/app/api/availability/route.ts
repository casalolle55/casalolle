import { NextResponse } from "next/server";
import { calendar } from "@googleapis/calendar";
import { JWT } from "google-auth-library";

export const runtime = "nodejs";
export const revalidate = 300;

type BusyRange = { start: string; end: string };

export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const keyB64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!calendarId || !keyB64) {
    return NextResponse.json({ busy: [] as BusyRange[], mock: true });
  }

  try {
    const credentials = JSON.parse(
      Buffer.from(keyB64, "base64").toString("utf-8")
    );
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 18, 0).toISOString();

    const cal = calendar({ version: "v3", auth });
    const res = await cal.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 2500,
    });

    const busy: BusyRange[] = (res.data.items ?? [])
      .filter((e) => e.status !== "cancelled" && e.transparency !== "transparent")
      .map((e) => ({
        start: e.start?.dateTime ?? e.start?.date ?? "",
        end: e.end?.dateTime ?? e.end?.date ?? "",
      }))
      .filter((b) => b.start && b.end);

    return NextResponse.json({ busy });
  } catch (err) {
    console.error("Availability fetch failed:", err);
    return NextResponse.json(
      { busy: [] as BusyRange[], error: "Failed to load availability" },
      { status: 500 }
    );
  }
}
