"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface TourMapProps {
  location: string
}

export function TourMap({ location }: TourMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would initialize your map here
    // For example, using Google Maps or Mapbox
    // For now, we'll just show a placeholder
  }, [location])

  return (
    <Card>
      <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
        <div ref={mapRef} className="absolute inset-0">
          <Image src="/placeholder.svg?height=400&width=600" alt="Tour location map" fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Map showing {location}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

