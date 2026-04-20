import { NextResponse } from "next/server";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  // TODO: hook up to a real email provider (Resend, Postmark, SendGrid, ...) or Payload email.
  // For now we log and return 200 so the UX is validated end-to-end.
  console.info("[contact] new submission", {
    firstName,
    lastName,
    email,
    messageLength: message.length,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
