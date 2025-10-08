import { Schema, model, models } from "mongoose"

const MedicineReminderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
    medicineName: { type: String, required: true },
    schedule: [{ type: Date, required: true }],
    lastSentAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const MedicineReminder = models.MedicineReminder || model("MedicineReminder", MedicineReminderSchema)
