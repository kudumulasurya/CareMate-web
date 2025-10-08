import { connectDB } from "@/lib/db"
import { MedicineReminder } from "@/models/MedicineReminder"
import { sendEmail } from "@/services/email"
import { json } from "@/app/api/_utils"

export async function POST() {
  await connectDB()
  const now = new Date()
  const upcoming = await MedicineReminder.find({ active: true })
  let sent = 0
  for (const r of upcoming) {
    // naive: if any schedule time is within past 10 minutes and lastSentAt is older, "send"
    const should = r.schedule.some((d: Date) => {
      const diff = Math.abs(+d - +now)
      return diff <= 10 * 60 * 1000
    })
    if (should && (!r.lastSentAt || +now - +r.lastSentAt > 8 * 60 * 1000)) {
      await sendEmail(
        "user@domain.tld",
        `Medicine Reminder: ${r.medicineName}`,
        `It's time for your medicine: ${r.medicineName}`,
      )
      r.lastSentAt = now
      await r.save()
      sent++
    }
  }
  return json({ success: true, sent })
}
