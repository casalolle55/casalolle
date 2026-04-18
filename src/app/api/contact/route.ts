import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, checkIn, checkOut, guests, message } = data;

    if (!name || !email || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock mode: log to console when no Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.log("Booking request (mock mode):", {
        name,
        email,
        checkIn,
        checkOut,
        guests,
        message,
      });
      return NextResponse.json({ success: true, mock: true });
    }

    // Real Resend API call
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Casa Lolle <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL,
        subject: `Booking Request: ${name} (${checkIn} - ${checkOut})`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Message:</strong> ${message || "—"}</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend owner-notify failed:", res.status, body);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Auto-reply to guest — best-effort. On Resend's unverified tier,
    // sending to non-owner addresses returns 403; we log and keep the
    // booking successful so the owner still gets notified.
    const replyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Casa Lolle <onboarding@resend.dev>",
        to: email,
        subject: "Your booking request for Casa Lolle",
        html: `
          <h2>Thank you, ${name}!</h2>
          <p>We've received your booking request for Casa Lolle.</p>
          <p><strong>Dates:</strong> ${checkIn} to ${checkOut}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p>We'll get back to you as soon as possible.</p>
          <p>Warm regards,<br>Casa Lolle</p>
        `,
      }),
    });
    if (!replyRes.ok) {
      console.warn("Auto-reply skipped:", replyRes.status, await replyRes.text());
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
