import Image from "next/image"
import { notFound } from "next/navigation"
import { MapPin } from "lucide-react"
import { TourCard } from "@/components/tour-card"
import { getAllTours } from "@/lib/airtable"
import { getStoredRecords } from "@/lib/admin/sync-utils"
import { PostType, type Destination } from "@/lib/types"

interface DestinationPageProps {
  params: { slug: string }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const destinations = getStoredRecords<Destination>(PostType.DESTINATION)
  const destination = destinations.find((d) => d.slug === params.slug)

  if (!destination) {
    notFound()
  }

  const tours = await getAllTours()
  const destinationTours = tours.filter((tour) => tour.destinationId === destination.id)

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src={destination.image || "/placeholder.svg?height=400&width=1200"}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{destination.name}</h1>
            {destination.location?.address && (
              <div className="flex items-center text-white/90">
                <MapPin className="h-5 w-5 mr-2" />
                {destination.location.address}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        {/* Description */}
        <div className="max-w-3xl mb-12">
          <p className="text-lg text-muted-foreground">
            {destination.description || `Explore the amazing tours and activities in ${destination.name}.`}
          </p>
        </div>

        {/* Tours */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Tours in {destination.name} ({destinationTours.length})
          </h2>

          {destinationTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinationTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tours available in this destination yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

