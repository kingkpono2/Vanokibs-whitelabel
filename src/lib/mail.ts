import nodemailer from 'nodemailer';

export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.CONTACT_TO);

type Mail = { to: string; subject: string; text: string; replyTo?: string; attachments?: { filename: string; content: string; contentType: string }[] };

/** Sends through the SMTP settings in Vercel. Returns false (without throwing) when SMTP isn't set up. */
export async function sendMail(m: Mail) {
  if (!mailConfigured()) return false;
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: process.env.CONTACT_FROM || process.env.SMTP_USER, ...m });
  return true;
}
