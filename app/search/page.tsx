"use client"

import { useState } from "react"
import { TourCard } from "@/components/tour-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])

  // In a real app, these would come from your API
  const tours = []
  const loading = false

  return (
    <div className="container px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tours, activities, or destinations..." className="pl-9" />
          </div>
        </div>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:w-[180px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Tours</SheetTitle>
              <SheetDescription>Adjust filters to find your perfect tour</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider value={priceRange} min={0} max={1000} step={10} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="font-medium mb-4">Duration</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="duration-1" />
                    <label htmlFor="duration-1" className="ml-2">
                      Up to 3 hours
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="duration-2" />
                    <label htmlFor="duration-2" className="ml-2">
                      3-6 hours
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="duration-3" />
                    <label htmlFor="duration-3" className="ml-2">
                      6-12 hours
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="duration-4" />
                    <label htmlFor="duration-4" className="ml-2">
                      Full day
                    </label>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="cat-1" />
                    <label htmlFor="cat-1" className="ml-2">
                      Water Activities
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-2" />
                    <label htmlFor="cat-2" className="ml-2">
                      Desert Safari
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="cat-3" />
                    <label htmlFor="cat-3" className="ml-2">
                      Historical Tours
                    </label>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-medium mb-4">Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="feature-1" />
                    <label htmlFor="feature-1" className="ml-2">
                      Free Cancellation
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="feature-2" />
                    <label htmlFor="feature-2" className="ml-2">
                      Skip the Line
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="feature-3" />
                    <label htmlFor="feature-3" className="ml-2">
                      Private Tour
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setIsFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading state
          Array.from({ length: 8 }).map((_, i) => <Card key={i} className="h-[400px] animate-pulse" />)
        ) : tours.length > 0 ? (
          // Results
          tours.map((tour) => <TourCard key={tour.id} tour={tour} />)
        ) : (
          // No results
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No tours found matching your criteria.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

