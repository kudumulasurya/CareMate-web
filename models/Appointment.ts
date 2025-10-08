import { Schema, model, models } from "mongoose"

const AppointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    start: { type: Date, required: true, index: true },
    end: { type: Date, required: true, index: true },
    slot: {
      dayOfWeek: Number,
      startTime: String,
      endTime: String,
      slotDuration: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no_show"],
      default: "confirmed",
    },
    notes: String,
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
  },
  { timestamps: true },
)

export const Appointment = models.Appointment || model("Appointment", AppointmentSchema)
