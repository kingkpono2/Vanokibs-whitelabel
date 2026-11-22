import nodemailer from 'nodemailer';
import { readStore, type MailSettings } from './admin';

/** SMTP settings: Vercel environment variables if set, otherwise the encrypted admin store. */
async function settings(): Promise<MailSettings | null> {
  if (process.env.SMTP_HOST && process.env.CONTACT_TO) {
    return {
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '', from: process.env.CONTACT_FROM || process.env.SMTP_USER || '', fromName: '', notifyTo: process.env.CONTACT_TO,
    };
  }
  const mail = (await readStore()).store?.mail;
  return mail?.host && mail.from ? mail : null;
}

export async function mailConfigured() {
  return Boolean(await settings());
}

/** Where contact-form and booking notifications go. */
export async function notifyAddress() {
  return (await settings())?.notifyTo || '';
}

type Mail = { to: string; subject: string; text: string; replyTo?: string; attachments?: { filename: string; content: string; contentType: string }[] };

/** Sends an email. Returns false (without throwing) when email isn't set up. */
export async function sendMail(m: Mail) {
  const s = await settings();
  if (!s || !m.to) return false;
  const transport = nodemailer.createTransport({
    host: s.host, port: s.port, secure: s.port === 465,
    auth: s.user ? { user: s.user, pass: s.pass } : undefined,
  });
  await transport.sendMail({ from: s.fromName ? `"${s.fromName}" <${s.from}>` : s.from, ...m });
  return true;
}
