import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

type NewsletterPayload = {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NEWSLETTER_RECIPIENTS = (process.env.NEWSLETTER_RECIPIENTS ||
  "laura@thegrid.agency")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

export async function POST(request: Request) {
  let body: NewsletterPayload;
  try {
    body = (await request.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const legacyName = (body.name || "").trim();
  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const company = (body.company || "").trim();
  const jobTitle = (body.jobTitle || "").trim();
  const source = (body.source || "footer").trim().slice(0, 80);

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || legacyName;
  const subject = fullName
    ? `New access request — ${fullName}`
    : "New access request";
  const text = [
    `A new access request has been submitted from the ${source}.`,
    "",
    `Email: ${email}`,
    fullName ? `Name: ${fullName}` : null,
    company ? `Company: ${company}` : null,
    jobTitle ? `Job title: ${jobTitle}` : null,
    `Received at: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendMail({
    to: NEWSLETTER_RECIPIENTS,
    subject,
    text,
    replyTo: email,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "We could not register your request. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Access request received" });
}
