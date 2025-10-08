import { Schema, model, models } from "mongoose"

const VirtualDoctorInteractionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    inputSymptoms: String,
    predictedDiseases: [{ name: String, probability: Number }],
    modelUsed: String,
    modelVersion: String,
    explanation: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const VirtualDoctorInteraction =
  models.VirtualDoctorInteraction || model("VirtualDoctorInteraction", VirtualDoctorInteractionSchema)
