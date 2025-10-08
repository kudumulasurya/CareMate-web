import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Appointment } from "@/models/Appointment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const auth = await requireAuth(["admin"])
  if (!auth) return null

  await connectDB()
  const totalDoctors = await User.countDocuments({ role: "doctor" })
  const totalPatients = await User.countDocuments({ role: "user" })
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000)
  const totalAppointmentsLast30d = await Appointment.countDocuments({ start: { $gte: since } })

  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{totalDoctors}</CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{totalPatients}</CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Appointments (30d)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{totalAppointmentsLast30d}</CardContent>
        </Card>
      </div>
      <div>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Recent Trends</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Add Recharts line chart here as needed.</CardContent>
        </Card>
      </div>
    </main>
  )
}
