import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { VirtualDoctorInteraction } from "@/models/VirtualDoctorInteraction"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  
  await connectDB()
  
  // Get recent predictions
  const predictions = await VirtualDoctorInteraction.find({
    userId: auth.sub
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
  
  return json(predictions)
}
