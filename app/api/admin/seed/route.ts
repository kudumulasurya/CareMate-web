import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Appointment } from "@/models/Appointment"
import { hashPassword } from "@/lib/auth"
import { json, error } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  if (!secret || secret !== process.env.ADMIN_CREATION_SECRET) return error("Forbidden", 403)
  await connectDB()
  // create sample doctor (approved), user, and appointment
  const pwd = await hashPassword("Pass123!")
  const doctor = await User.create({
    email: "doc@example.com",
    passwordHash: pwd,
    name: { first: "John", last: "Doe" },
    role: "doctor",
    isVerified: true,
    doctorProfile: {
      specialization: "Cardiology",
      yearsExperience: 6,
      qualifications: ["MBBS", "MD"],
      isApproved: true,
      availableSlots: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", slotDurationMins: 30 },
        { dayOfWeek: 3, startTime: "14:00", endTime: "17:00", slotDurationMins: 30 },
      ],
    },
  })
  const user = await User.create({
    email: "user@example.com",
    passwordHash: pwd,
    name: { first: "Alice", last: "Smith" },
    role: "user",
    isVerified: true,
  })
  await Appointment.create({
    patientId: user._id,
    doctorId: doctor._id,
    start: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    end: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 30 * 60 * 1000),
    status: "confirmed",
  })
  return json({ success: true, doctorId: doctor._id, userId: user._id })
}
