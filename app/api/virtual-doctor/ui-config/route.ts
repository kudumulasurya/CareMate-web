import { json } from "@/app/api/_utils"

export async function GET() {
  return json({
    inputPlaceholder: "Describe your symptoms...",
    actions: ["Run prediction", "Book a doctor"],
  })
}
