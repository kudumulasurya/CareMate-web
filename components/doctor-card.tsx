"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-pretty">
          {doctor.name?.first} {doctor.name?.last}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <div>Specialization: {doctor.doctorProfile?.specialization || "—"}</div>
          <div>Experience: {doctor.doctorProfile?.yearsExperience || 0} yrs</div>
        </div>
        <Button asChild>
          <Link href={`/doctors/${doctor._id}`}>View</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
