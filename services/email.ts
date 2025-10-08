export async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.SENDGRID_API_KEY
  if (!key) {
    console.log("[email] SENDGRID_API_KEY missing, logging only =>", { to, subject, text })
    return { ok: true, logged: true }
  }
  try {
    // Placeholder: implement @sendgrid/mail only if needed
    console.log("[email] (stub) would send:", { to, subject })
    return { ok: true }
  } catch (e) {
    console.error("[email] error", e)
    return { ok: false }
  }
}
