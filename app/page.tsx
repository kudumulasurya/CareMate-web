import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Hospital Management System</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/auth/register">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4">
        <h2 className="text-xl font-medium">Find Doctors</h2>
        <p className="text-muted-foreground">Browse approved doctors and book an appointment.</p>
        <Button asChild>
          <Link href="/doctors">Browse Doctors</Link>
        </Button>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-medium">Virtual Doctor</h2>
        <p className="text-muted-foreground">Chat with our virtual assistant and get a preliminary suggestion.</p>
        <Button variant="secondary" asChild>
          <Link href="/virtual-doctor">Open Virtual Doctor</Link>
        </Button>
      </section>
    </main>
  )
}
