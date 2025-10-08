"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApproveDoctorsPage() {
  const { data, mutate } = useSWR("/api/admin/doctors?isApproved=false&page=1&pageSize=20", (url) => jsonFetch(url))
  const items = data?.items || []

  async function approve(id: string, approve: boolean) {
    await fetch(`/api/admin/approve-doctor/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ approve }),
    })
    mutate()
  }

  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Approve Doctors</h1>
      {items.map((d: any) => (
        <Card key={d._id} className="bg-card">
          <CardHeader>
            <CardTitle>
              {d.name?.first} {d.name?.last}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{d.doctorProfile?.specialization}</div>
            <div className="flex gap-2">
              <Button onClick={() => approve(d._id, true)}>Approve</Button>
              <Button variant="secondary" onClick={() => approve(d._id, false)}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 ? <p className="text-muted-foreground">No pending doctors.</p> : null}
    </main>
  )
}
