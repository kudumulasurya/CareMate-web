import { requireAuth } from "@/lib/auth"

export default async function UserDashboard() {
  const auth = await requireAuth(["user"])
  if (!auth) return null
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">My Dashboard</h1>
      <p className="text-muted-foreground">Upcoming appointments and prescriptions appear here.</p>
    </main>
  )
}
