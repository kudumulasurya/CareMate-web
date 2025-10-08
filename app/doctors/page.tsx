import { jsonFetch } from "@/lib/fetcher"
import { DoctorCard } from "@/components/doctor-card"

export default async function DoctorsListPage() {
  const doctors = await jsonFetch<any[]>("/api/doctors", { cache: "no-store" as any })
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Doctors</h1>
      <div className="grid gap-3">
        {doctors.map((d) => (
          <DoctorCard key={d._id} doctor={d} />
        ))}
      </div>
    </main>
  )
}
