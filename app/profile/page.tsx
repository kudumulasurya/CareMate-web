"use client"
import useSWR from "swr"
import { useUser } from "@/hooks/use-user"
import { jsonFetch } from "@/lib/fetcher"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const { data, mutate } = useSWR(user?._id ? `/api/users/${user._id}` : null, (url) => jsonFetch(url))
  const [address, setAddress] = useState(data?.profile?.address || "")

  async function save() {
    await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ profile: { ...(data?.profile || {}), address } }),
    })
    mutate()
  }

  if (!user) return <main className="max-w-xl mx-auto p-6">Loading...</main>

  return (
    <main className="max-w-xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <label className="text-sm">Address</label>
      <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      <Button onClick={save}>Save</Button>
    </main>
  )
}
