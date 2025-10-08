import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import dayjs from "dayjs"

export default async function DoctorDashboard() {
  const auth = await requireAuth(["doctor"])
  if (!auth) return null

  await connectDB()
  const startOfDay = dayjs().startOf("day").toDate()
  const endOfDay = dayjs().endOf("day").toDate()

  const todays = await Appointment.find({
    doctorId: auth.sub,
    start: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ start: 1 })
    .limit(50)
    .lean()

  const upcoming = await Appointment.find({
    doctorId: auth.sub,
    start: { $gt: endOfDay },
  })
    .sort({ start: 1 })
    .limit(10)
    .lean()

  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Today's Schedule</h2>
        {todays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments today.</p>
        ) : (
          <ul className="grid gap-2">
            {todays.map((a: any) => (
              <li key={String(a._id)} className="text-sm">
                {dayjs(a.start).format("HH:mm")} - {dayjs(a.end).format("HH:mm")} • Patient: {String(a.patientId)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <ul className="grid gap-2">
            {upcoming.map((a: any) => (
              <li key={String(a._id)} className="text-sm">
                {dayjs(a.start).format("MMM D, HH:mm")} • Patient: {String(a.patientId)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
