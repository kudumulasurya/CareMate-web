"use client"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { jsonFetch } from "@/lib/fetcher"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const { data } = useSWR(`/api/doctors/${params.id}`, (url) => jsonFetch(url))
  const { data: me } = useSWR("/api/auth/me", (url) => jsonFetch(url))
  const router = useRouter()

  async function book(start: Date, end: Date) {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ doctorId: params.id, start: start.toISOString(), end: end.toISOString() }),
    })
    if (!res.ok) {
      const b = await res.json().catch(() => ({}))
      alert(b?.error || "Booking failed")
      return
    }
    alert("Booked! Check your appointments.")
    router.push("/appointments")
  }

  if (!data) return <main className="max-w-3xl mx-auto p-6">Loading...</main>

  return (
    <main className="max-w-3xl mx-auto p-6 grid gap-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            {data.name?.first} {data.name?.last}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="text-sm text-muted-foreground">Specialization: {data.doctorProfile?.specialization}</div>
          <div className="text-sm text-muted-foreground">Experience: {data.doctorProfile?.yearsExperience} yrs</div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Book an appointment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {me?.role === "admin" ? (
            <p className="text-sm text-muted-foreground">Admins cannot book appointments.</p>
          ) : (
            <>
              <AvailabilityCalendar availableSlots={data.doctorProfile?.availableSlots || []} onPick={book} />
              <Button variant="secondary" onClick={() => router.push("/appointments")}>
                View my appointments
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
