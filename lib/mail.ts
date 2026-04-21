import { Resend } from "resend";

export type SendMailParams = {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendMailResult =
  | { ok: true; provider: "resend" | "log" }
  | { ok: false; error: string };

const FROM_ADDRESS =
  process.env.MAIL_FROM || "The Grid Agency <no-reply@thegrid.agency>";

let cachedClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!cachedClient) {
    cachedClient = new Resend(process.env.RESEND_API_KEY);
  }
  return cachedClient;
}

export async function sendMail(params: SendMailParams): Promise<SendMailResult> {
  const resend = getResend();
  if (!resend) {
    console.info("[mail] RESEND_API_KEY missing — logging submission instead", {
      to: params.to,
      subject: params.subject,
      replyTo: params.replyTo,
      bodyLength: params.text.length,
    });
    return { ok: true, provider: "log" };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.text,
    });
    if (error) {
      console.error("[mail] resend error", error);
      return { ok: false, error: error.message || "Email provider error." };
    }
    return { ok: true, provider: "resend" };
  } catch (err) {
    console.error("[mail] resend threw", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Email provider error.",
    };
  }
}
