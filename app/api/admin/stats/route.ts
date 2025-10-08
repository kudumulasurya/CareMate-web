import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { error, json } from "@/app/api/_utils"

export async function GET() {
  const auth = await requireAuth(["admin"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  // appointments by day (last 7)
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const agg = await Appointment.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])
  return json({ appointmentsByDay: agg })
}
