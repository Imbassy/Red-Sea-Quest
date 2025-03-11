"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Tour } from "@/lib/types"

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  // Handle missing image
  const imageUrl = tour.image && tour.image.trim() !== "" ? tour.image : "/placeholder.svg?height=300&width=400"

  // Ensure price is a valid number
  const price = typeof tour.price === "number" && !isNaN(tour.price) ? tour.price : 0

  // Ensure rating is a valid number
  const rating = typeof tour.rating === "number" && !isNaN(tour.rating) ? tour.rating : 4.5

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-[4/3] relative">
        <Link href={`/tours/${tour.id}`}>
          <div className="relative w-full h-full">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={tour.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          {tour.featured && <Badge className="absolute top-2 left-2 z-10">Featured</Badge>}
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {tour.location}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <Link href={`/tours/${tour.id}`} className="block">
          <h3 className="font-semibold line-clamp-2 mb-1 hover:text-primary transition-colors">{tour.name}</h3>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="h-3 w-3 mr-1" />
          {tour.duration}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {tour.shortDescription || "Experience this amazing tour in the Red Sea region."}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="font-semibold">${price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground"> per person</span>
        </div>
        <Link href={`/tours/${tour.id}`} className="text-sm font-medium text-primary hover:underline">
          View details
        </Link>
      </CardFooter>
    </Card>
  )
}

