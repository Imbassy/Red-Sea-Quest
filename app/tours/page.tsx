import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TourCard } from "@/components/tour-card"
import { TourFilters } from "@/components/tour-filters"
import { getAllTours } from "@/lib/airtable"

export default async function ToursPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const tours = await getAllTours(category)

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {category
          ? `${category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")} Tours`
          : "All Tours"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="hidden lg:block">
              <TourFilters />
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">Showing {tours.length} tours</p>
            <div className="flex items-center gap-2">
              <select className="bg-background border rounded-md px-3 py-1 text-sm">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Duration: Short to Long</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No tours found</h3>
              <p className="text-muted-foreground mb-6">There are no tours available in this category yet.</p>
              <Button asChild>
                <a href="/tours">View All Tours</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

