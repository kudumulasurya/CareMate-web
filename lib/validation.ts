import { z } from "zod"

export const nameSchema = z.object({
  first: z.string().min(1),
  last: z.string().min(1),
})

export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  profile: z
    .object({
      age: z.number().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      address: z.string().optional(),
      bloodGroup: z.string().optional(),
      medicalHistory: z.array(z.string()).optional(),
    })
    .optional(),
})

export const registerDoctorSchema = registerSchema.extend({
  doctorProfile: z.object({
    specialization: z.string(),
    yearsExperience: z.number().min(0),
    qualifications: z.array(z.string()),
    clinicAddress: z.string().optional(),
    availableSlots: z
      .array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string(), // "HH:MM"
          endTime: z.string(),
          slotDurationMins: z.number().min(5),
        }),
      )
      .optional(),
    bio: z.string().optional(),
    consultationFee: z.number().optional(),
  }),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const appointmentCreateSchema = z.object({
  doctorId: z.string(),
  start: z.string(), // ISO
  end: z.string(), // ISO
  notes: z.string().optional(),
})

export const prescriptionCreateSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  diagnosedDiseases: z
    .array(z.object({ name: z.string(), icdCode: z.string().optional(), confidence: z.number().optional() }))
    .default([]),
  medicines: z
    .array(
      z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        durationDays: z.number(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  advice: z.string().default(""),
})

export const reminderCreateSchema = z.object({
  userId: z.string(),
  prescriptionId: z.string().optional(),
  medicineName: z.string(),
  schedule: z.array(z.string()), // ISO strings for now
  active: z.boolean().default(true),
})

export const virtualPredictSchema = z.object({
  userId: z.string().optional(),
  symptoms: z.string().min(3),
})
