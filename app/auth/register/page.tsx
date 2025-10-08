"use client"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Values = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: { first: "", last: "" }, email: "", password: "" } as any,
  })

  async function onSubmit(values: Values) {
    setError(null)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const b = await res.json().catch(() => ({}))
      setError(b?.error || "Failed to register")
      return
    }
    router.push("/auth/login")
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <Input placeholder="First name" {...register("name.first")} />
            <Input placeholder="Last name" {...register("name.last")} />
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Password" type="password" {...register("password")} />
            {error ? <p className="text-destructive text-sm">{error}</p> : null}
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
