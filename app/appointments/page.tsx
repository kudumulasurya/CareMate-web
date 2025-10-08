"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import dayjs from "dayjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyAppointmentsPage() {
  const { data } = useSWR("/api/appointments", (url) => jsonFetch(url))
  const items = (data as any[]) || []
  return (
    <main className="max-w-4xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">My Appointments</h1>
      {items.map((a) => (
        <Card key={a._id} className="bg-card">
          <CardHeader>
            <CardTitle>{dayjs(a.start).format("YYYY-MM-DD HH:mm")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Status: {a.status}</CardContent>
        </Card>
      ))}
      {items.length === 0 ? <p className="text-muted-foreground">No appointments yet.</p> : null}
    </main>
  )
}
