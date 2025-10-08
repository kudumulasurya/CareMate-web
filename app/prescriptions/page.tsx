"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyPrescriptionsPage() {
  const { user } = useUser()
  const { data } = useSWR(user?._id ? `/api/prescriptions/${user._id}` : null, (url) => jsonFetch(url))
  const items = (data as any[]) || []
  return (
    <main className="max-w-4xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">My Prescriptions</h1>
      {items.map((p) => (
        <Card key={p._id} className="bg-card">
          <CardHeader>
            <CardTitle>Prescription</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Diagnoses: {(p.diagnosedDiseases || []).map((d: any) => d.name).join(", ") || "—"}
          </CardContent>
        </Card>
      ))}
      {items.length === 0 ? <p className="text-muted-foreground">No prescriptions yet.</p> : null}
    </main>
  )
}
