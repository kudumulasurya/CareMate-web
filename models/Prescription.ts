import { Schema, model, models } from "mongoose"

const PrescriptionSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    diagnosedDiseases: [{ name: String, icdCode: String, confidence: Number }],
    medicines: [{ name: String, dosage: String, frequency: String, durationDays: Number, notes: String }],
    advice: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Prescription = models.Prescription || model("Prescription", PrescriptionSchema)
