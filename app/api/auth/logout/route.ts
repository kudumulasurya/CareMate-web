import { json } from "@/app/api/_utils"
import { clearAuthCookiesOnResponse } from "@/lib/auth"

export async function POST() {
  const res = json({ success: true })
  clearAuthCookiesOnResponse(res)
  return res
}
