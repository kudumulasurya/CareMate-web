"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Msg = { from: "user" | "bot"; text: string }

export function VirtualDoctorChat() {
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: "Hi! Describe your symptoms to begin." }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function runPrediction() {
    if (!input.trim()) return
    const userMsg: Msg = { from: "user", text: input }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/virtual-doctor/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userMsg.text }),
      })
      const data = await res.json()
      const txt =
        `Predictions:\n` +
        data.predictions.map((p: any) => `• ${p.disease} (${Math.round(p.probability * 100)}%)`).join("\n") +
        `\n\n${data.explanation}`
      // simulate streaming
      let acc = ""
      for (const ch of txt) {
        acc += ch
        await new Promise((r) => setTimeout(r, 4))
        setMessages((m) => [...m.slice(0, -0), { from: "bot", text: acc }])
      }
    } catch (e: any) {
      setMessages((m) => [...m, { from: "bot", text: "Sorry, something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-pretty">Virtual Doctor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div
          className="border rounded-md p-3 h-64 overflow-auto bg-background"
          role="log"
          aria-live="polite"
          aria-label="Chat transcript"
        >
          {messages.map((m, i) => (
            <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
              <span className="inline-block px-3 py-2 my-1 rounded-md bg-secondary text-foreground">{m.text}</span>
            </div>
          ))}
          {loading ? <div className="text-sm text-muted-foreground">Thinking...</div> : null}
        </div>
        <Textarea
          aria-label="Symptom input"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button onClick={runPrediction} disabled={loading || !input.trim()}>
            Run prediction
          </Button>
          <Button variant="secondary" asChild>
            <a href="/doctors">Book a doctor</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
