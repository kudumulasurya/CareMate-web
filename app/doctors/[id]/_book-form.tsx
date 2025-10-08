"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function BookForm({ doctorId }: { doctorId: string }) {
  const [when, setWhen] = useState("")
  const [notes, setNotes] = useState("")
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, startsAt: when, notes }),
    })
    setLoading(false)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg(data?.error || "Failed to book")
      return
    }
    setMsg("Appointment booked!")
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 max-w-md">
      <div className="grid gap-1.5">
        <Label htmlFor="when">Choose date & time</Label>
        <Input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {msg && <p className="text-sm">{msg}</p>}
      <Button disabled={loading}>{loading ? "Booking..." : "Book appointment"}</Button>
    </form>
  )
}
