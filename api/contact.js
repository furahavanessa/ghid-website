// Contact form sender (Vercel serverless function).
// The website posts the form here; this function emails it to info@ghidcongo.org.
//
// The mailbox password is NOT in this file. Set these in Vercel:
//   Project → Settings → Environment Variables
//     SMTP_HOST   the mail server, e.g. mail.ghidcongo.org (ask your email host)
//     SMTP_PORT   usually 465 (or 587)
//     SMTP_USER   info@ghidcongo.org
//     SMTP_PASS   the mailbox password
//     MAIL_TO     (optional) where messages go; defaults to info@ghidcongo.org
// Then redeploy. See README.md, "Contact form".

const nodemailer = require("nodemailer");

const TOPICS = {
  general: "General enquiry / Demande générale",
  research: "Research collaboration / Collaboration de recherche",
  funding: "Funding or partnership / Financement ou partenariat",
  media: "Media or speaking request / Demande média ou intervention",
  other: "Other / Autre",
};

const clean = (v, max) => String(v || "").replace(/\r/g, "").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Spam trap: real visitors never fill the hidden "website" field.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const topic = TOPICS[body.topic] ? body.topic : "general";

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid fields" });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: SMTP settings are missing in Vercel environment variables.");
    return res.status(500).json({ ok: false, error: "Email is not configured yet" });
  }

  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const to = process.env.MAIL_TO || "info@ghidcongo.org";
  const subject = `[GHID website] ${TOPICS[topic]} — ${name}`;
  const text = `Topic: ${TOPICS[topic]}\nName: ${name}\nEmail: ${email}\nLanguage: ${body.lang === "fr" ? "French" : "English"}\n\n${message}\n`;
  const html = `<p><b>Topic:</b> ${esc(TOPICS[topic])}<br><b>Name:</b> ${esc(name)}<br><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p><p style="white-space:pre-wrap">${esc(message)}</p>`;

  try {
    await transporter.sendMail({
      from: `"GHID website" <${SMTP_USER}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject,
      text,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form: sending failed:", err && err.message);
    return res.status(502).json({ ok: false, error: "Could not send the message" });
  }
};
