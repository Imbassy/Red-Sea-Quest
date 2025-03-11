import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getStoredRecords } from "@/lib/admin/sync-utils"
import { PostType, type Category } from "@/lib/types"

export default function CategoriesPage() {
  // In a real app, these would come from your database
  // For now, we'll use the in-memory store from sync-utils
  const categories = getStoredRecords<Category>(PostType.CATEGORY)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Tour Categories</h1>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/tours?category=${category.slug}`}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={category.image || "/placeholder.svg?height=300&width=400"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end">
                    <div className="p-4 text-white">
                      <h2 className="font-bold text-xl">{category.name}</h2>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || `Explore our ${category.name} tours and activities.`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Categories Found</h2>
          <p className="text-muted-foreground mb-6">
            There are no categories available yet. Please check back later or browse all tours.
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

