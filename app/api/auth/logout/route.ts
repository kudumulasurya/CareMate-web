import { json } from "@/app/api/_utils"
import { clearAuthCookies } from "@/lib/auth"

export async function POST() {
  clearAuthCookies()
  return json({ success: true })
}
