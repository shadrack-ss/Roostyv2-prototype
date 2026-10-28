import nodemailer, { type Transporter } from "nodemailer";

/**
 * Best-effort outgoing mail over SMTP. With the SMTP_* variables unset it logs
 * one warning and returns { sent: false } instead of throwing, so a missing
 * mail setup never breaks a booking or contact submission - the database row
 * is always the source of truth.
 */

type SendArgs = { to: string; subject: string; text: string; replyTo?: string };
type SendResult = { sent: boolean; error?: string };

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const fromName = process.env.MAIL_FROM_NAME ?? "Website";

let transporter: Transporter | null = null;
let warnedMissing = false;

function getTransporter(): Transporter | null {
  if (!host || !user || !pass) {
    if (!warnedMissing) {
      console.warn("[mailer] SMTP_HOST / SMTP_USER / SMTP_PASSWORD not all set - email is disabled.");
      warnedMissing = true;
    }
    return null;
  }
  transporter ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user, pass },
  });
  return transporter;
}

export async function sendMail({ to, subject, text, replyTo }: SendArgs): Promise<SendResult> {
  const tx = getTransporter();
  if (!tx) return { sent: false, error: "SMTP not configured" };
  try {
    await tx.sendMail({ from: `"${fromName}" <${user}>`, to, subject, text, replyTo });
    return { sent: true };
  } catch (error) {
    console.error("[mailer] send failed:", error);
    return { sent: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** The address staff notifications go to: the admin setting, then env, then the SMTP account. */
export function notifyAddress(fromSettings: string): string | null {
  return fromSettings || process.env.NOTIFY_TO || user || null;
}
