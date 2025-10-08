import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardEntry() {
  const auth = await requireAuth()
  if (!auth) redirect("/auth/login")
  if (auth.role === "admin") redirect("/dashboard/admin")
  if (auth.role === "doctor") redirect("/dashboard/doctor")
  redirect("/dashboard/user")
}
