"use client"
import useSWR from "swr"
import { jsonFetch } from "@/lib/fetcher"

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/me", (url) => jsonFetch(url))
  return { user: data as any, error, isLoading, mutate }
}
