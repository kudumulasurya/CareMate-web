"use client"
import { useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"

export function AvailabilityCalendar({
  availableSlots,
  onPick,
}: {
  availableSlots: { dayOfWeek: number; startTime: string; endTime: string; slotDurationMins: number }[]
  onPick: (start: Date, end: Date) => void
}) {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"))

  const slots: { start: Date; end: Date }[] = []
  const d = dayjs(date)
  const dow = d.day()
  const defs = availableSlots?.filter((s) => s.dayOfWeek === dow) || []
  for (const def of defs) {
    const [sh, sm] = def.startTime.split(":").map(Number)
    const [eh, em] = def.endTime.split(":").map(Number)
    let cur = d.hour(sh).minute(sm).second(0).millisecond(0)
    const end = d.hour(eh).minute(em).second(0).millisecond(0)
    while (cur.isBefore(end)) {
      const next = cur.add(def.slotDurationMins, "minute")
      if (next.isAfter(end)) break
      slots.push({ start: cur.toDate(), end: next.toDate() })
      cur = next
    }
  }

  return (
    <div className="grid gap-3">
      <label className="text-sm">Choose date</label>
      <input
        aria-label="Choose date"
        className="border rounded-md bg-background px-3 py-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {slots.length === 0 ? <p className="text-sm text-muted-foreground">No slots for selected date.</p> : null}
        {slots.map((s, i) => (
          <Button key={i} variant="secondary" onClick={() => onPick(s.start, s.end)}>
            {dayjs(s.start).format("HH:mm")} - {dayjs(s.end).format("HH:mm")}
          </Button>
        ))}
      </div>
    </div>
  )
}
