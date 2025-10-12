import { connectDB } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET() {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const user = await User.findById(auth.sub).select("-passwordHash").lean()
  if (!user) return error("Not found", 404)
  
  // Format response
  const formattedUser = {
    id: String(user._id),
    email: user.email,
    name: user.name ? `${user.name.first} ${user.name.last}` : 'User',
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    profile: user.profile,
    isVerified: user.isVerified,
    doctorProfile: user.doctorProfile
  }
  
  return json(formattedUser)
}
