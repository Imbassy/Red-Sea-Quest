import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { getStoredRecords } from "@/lib/admin/sync-utils"
import { PostType, type Destination } from "@/lib/types"

export default function DestinationsPage() {
  // In a real app, these would come from your database
  // For now, we'll use the in-memory store from sync-utils
  const destinations = getStoredRecords<Destination>(PostType.DESTINATION)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.slug}`}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="aspect-video relative">
                  <Image
                    src={destination.image || "/placeholder.svg?height=300&width=400"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end">
                    <div className="p-4 text-white">
                      <h2 className="font-bold text-xl">{destination.name}</h2>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {destination.location?.address || "Red Sea, Egypt"}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {destination.description || `Explore the beautiful destination of ${destination.name}.`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Destinations Found</h2>
          <p className="text-muted-foreground mb-6">
            There are no destinations available yet. Please check back later or browse all tours.
          </p>
          <Link
            href="/tours"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Browse All Tours
          </Link>
        </div>
      )}
    </div>
  )
}

