import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, Star, Users, Shield, ThumbsUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { TourGallery } from "@/components/tour-gallery"
import { TourMap } from "@/components/tour-map"
import { ReviewsList } from "@/components/reviews-list"
import { RelatedTours } from "@/components/related-tours"
import { getTourById } from "@/lib/airtable"

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = await getTourById(params.id)

  if (!tour) {
    notFound()
  }

  // Handle missing image
  const imageUrl = tour.image && tour.image.trim() !== "" ? tour.image : "/placeholder.svg?height=600&width=1200"

  // Ensure numeric values are valid
  const rating = typeof tour.rating === "number" && !isNaN(tour.rating) ? tour.rating : 4.5
  const reviewCount = typeof tour.reviewCount === "number" && !isNaN(tour.reviewCount) ? tour.reviewCount : 0
  const price = typeof tour.price === "number" && !isNaN(tour.price) ? tour.price : 0
  const maxGroupSize = typeof tour.maxGroupSize === "number" && !isNaN(tour.maxGroupSize) ? tour.maxGroupSize : 10

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-black">
        <TourGallery images={[imageUrl]} />
      </div>

      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tour.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
                    <span className="ml-1 text-muted-foreground">({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.location}
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {tour.duration}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Up to {maxGroupSize} people
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Free cancellation
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Skip the line
                </Badge>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="mt-8">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="included">What's Included</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">About this activity</h2>
                    <p>{tour.description || tour.shortDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {tour.included?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Full Description</h2>
                    <div className="prose max-w-none">
                      <p>{tour.details || "More details about this tour will be provided upon booking."}</p>
                    </div>
                  </div>

                  <TourMap location={tour.location} />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Itinerary</h3>
                    <div className="space-y-4">
                      {tour.itinerary?.map((item, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="included" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-600">Included</h3>
                        <ul className="space-y-2">
                          {tour.included?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-green-500">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-600">Not Included</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <X className="h-4 w-4 mr-2 text-red-500" />
                            Gratuities
                          </li>
                          <li className="flex items-start">
                            <X className="h-4 w-4 mr-2 text-red-500" />
                            Personal expenses
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Important Information</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">What to bring</h3>
                        <ul className="space-y-2">
                          <li>• Comfortable shoes</li>
                          <li>• Sunscreen</li>
                          <li>• Camera</li>
                          <li>• Water</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Not allowed</h3>
                        <ul className="space-y-2">
                          <li>• Alcohol</li>
                          <li>• Smoking during activity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <ReviewsList reviews={tour.reviews} rating={rating} reviewCount={reviewCount} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-background border rounded-lg p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                    <span className="text-muted-foreground"> per person</span>
                  </div>
                  {tour.featured && (
                    <Badge variant="secondary" className="font-medium">
                      Popular
                    </Badge>
                  )}
                </div>

                <BookingForm tourId={tour.id} />

                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Free cancellation up to 24 hours before the tour
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration: {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Available: {tour.availability}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Tours You Might Like</h2>
          <RelatedTours currentTourId={tour.id} />
        </div>
      </div>
    </div>
  )
}

