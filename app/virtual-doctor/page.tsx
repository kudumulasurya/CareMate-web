import { VirtualDoctorChat } from "@/components/virtual-doctor-chat"

export default function VirtualDoctorPage() {
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6 md:grid-cols-2">
      <div className="md:col-span-1">
        <VirtualDoctorChat />
      </div>
      <aside className="md:col-span-1 grid gap-4">
        <div className="grid gap-2">
          <h2 className="text-xl font-medium">Symptom tips</h2>
          <p className="text-muted-foreground">
            Include duration, severity (mild/moderate/severe), triggers, and any medications taken.
          </p>
        </div>
        <div className="grid gap-2">
          <a className="underline" href="/doctors">
            Prefer a human doctor? Browse doctors
          </a>
        </div>
      </aside>
    </main>
  )
}
