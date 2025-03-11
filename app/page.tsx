import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TourCard } from "@/components/tour-card"
import { getFeaturedTours } from "@/lib/airtable"

export default async function Home() {
  console.log("Rendering Home page, fetching featured tours...")
  const featuredTours = await getFeaturedTours()
  console.log(`Received ${featuredTours.length} tours for homepage`)

  // If no featured tours are found, we'll show a message
  const hasFeaturedTours = featuredTours.length > 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/placeholder.svg?height=500&width=1200')",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              Discover the Wonders of the Red Sea
            </h1>
            <p className="text-xl text-white/90 max-w-[700px]">
              Explore the vibrant coral reefs, historic sites, and breathtaking landscapes of Egypt's Red Sea
            </p>

            <div className="w-full max-w-md mt-6 bg-white rounded-lg shadow-lg p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tours, activities, and attractions..."
                  className="pl-8 pr-4 py-2 w-full"
                />
                <Button className="absolute right-0 top-0 rounded-l-none">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted/40">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Popular Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tours?category=${category.slug}`}
                className="group relative h-40 overflow-hidden rounded-lg bg-muted hover:shadow-md transition-all"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${category.image}')`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {hasFeaturedTours ? "Featured Tours" : "Popular Tours"}
            </h2>
            <Link href="/tours" className="flex items-center text-primary font-medium">
              View all tours <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {hasFeaturedTours ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                No featured tours found. Add some tours in your Airtable base!
              </p>
              <Button asChild>
                <Link href="/tours">Browse All Tours</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-muted/40">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const categories = [
  {
    id: 1,
    name: "Diving & Snorkeling",
    slug: "diving-snorkeling",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Desert Safaris",
    slug: "desert-safaris",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Boat Trips",
    slug: "boat-trips",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Historical Tours",
    slug: "historical-tours",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "United Kingdom",
    text: "The snorkeling tour was incredible! We saw so many colorful fish and even spotted a sea turtle. Our guide was knowledgeable and made sure everyone was comfortable in the water.",
  },
  {
    name: "Michael Chen",
    location: "United States",
    text: "The desert safari was the highlight of our trip. Watching the sunset over the mountains while enjoying traditional tea was magical. Highly recommend!",
  },
  {
    name: "Elena Petrova",
    location: "Russia",
    text: "We took the historical tour to St. Catherine's Monastery and it was fascinating. Our guide knew so much about the history and answered all our questions. The booking process was smooth and easy.",
  },
]

