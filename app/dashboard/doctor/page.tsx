import { requireAuth } from "@/lib/auth"

export default async function DoctorDashboard() {
  const auth = await requireAuth(["doctor"])
  if (!auth) return null
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
      <p className="text-muted-foreground">Today's schedule and patient list appear here.</p>
    </main>
  )
}
