"use client"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SettingsPage() {
  const { user } = useUser()
  const [when, setWhen] = useState<string>("")

  async function addReminder() {
    if (!when) return
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: user._id,
        medicineName: "Vitamin D",
        schedule: [new Date(when).toISOString()],
        active: true,
      }),
    })
    alert("Reminder saved")
  }

  return (
    <main className="max-w-xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <label className="text-sm">Add a test reminder time</label>
      <input
        className="border rounded-md px-3 py-2 bg-background"
        type="datetime-local"
        value={when}
        onChange={(e) => setWhen(e.target.value)}
      />
      <Button onClick={addReminder}>Save Reminder</Button>
      <p className="text-sm text-muted-foreground">Use POST /api/webhook/send-reminders to simulate sending.</p>
    </main>
  )
}
