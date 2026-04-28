import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_RECIPIENTS = (process.env.CONTACT_RECIPIENTS ||
  "jeremy@thegrid.agency,laura@thegrid.agency")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

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

  const subject = `New contact request — ${firstName} ${lastName}`;
  const text = [
    `From: ${firstName} ${lastName} <${email}>`,
    `Submitted at: ${new Date().toISOString()}`,
    "",
    message,
  ].join("\n");

  const result = await sendMail({
    to: CONTACT_RECIPIENTS,
    subject,
    text,
    replyTo: email,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "We could not send your message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
