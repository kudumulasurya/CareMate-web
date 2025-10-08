import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { VirtualDoctorInteraction } from "@/models/VirtualDoctorInteraction"
import { virtualPredictSchema } from "@/lib/validation"
import { predictDiseases } from "@/services/ml/llamaAdapter"
import { error, json } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const parsed = virtualPredictSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const res = await predictDiseases(parsed.data.symptoms)
  await VirtualDoctorInteraction.create({
    userId: parsed.data.userId,
    inputSymptoms: parsed.data.symptoms,
    predictedDiseases: res.predictions.map((p) => ({ name: p.disease, probability: p.probability })),
    explanation: res.explanation,
    modelUsed: res.modelUsed,
    modelVersion: res.modelVersion,
  })
  return json(res)
}
