import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["admin"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const { searchParams } = new URL(req.url)
  const isApproved = searchParams.get("isApproved")
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Math.min(Number(searchParams.get("pageSize") || "10"), 50)
  const filter: any = { role: "doctor" }
  if (isApproved === "true") filter["doctorProfile.isApproved"] = true
  if (isApproved === "false") filter["doctorProfile.isApproved"] = false
  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-passwordHash")
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    User.countDocuments(filter),
  ])
  return json({ items, total, page, pageSize })
}
