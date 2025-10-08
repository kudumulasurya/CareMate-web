import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import LogoutButton from "./site-logout-button"

export default async function SiteHeader() {
  const user = await getCurrentUser()
  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-medium">
          Hospital Management System
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/doctors" className="text-sm hover:underline">
            Doctors
          </Link>
          <Link href="/virtual-doctor" className="text-sm hover:underline">
            Virtual Doctor
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <Link href="/dashboard/admin" className="text-sm hover:underline">
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/approve-doctors" className="text-sm hover:underline">
                    Approvals
                  </Link>
                </>
              )}
              {user.role === "doctor" && (
                <Link href="/dashboard/doctor" className="text-sm hover:underline">
                  Doctor Dashboard
                </Link>
              )}
              {user.role === "user" && (
                <>
                  <Link href="/dashboard/user" className="text-sm hover:underline">
                    My Dashboard
                  </Link>
                  <Link href="/appointments" className="text-sm hover:underline">
                    My Appointments
                  </Link>
                </>
              )}
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="secondary" asChild size="sm">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
