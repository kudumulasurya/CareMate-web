export async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  console.log("called")
  console.log(url)
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  })
  console.log(res)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || `Request failed: ${res.status}`)
  }
  return res.json()
}
