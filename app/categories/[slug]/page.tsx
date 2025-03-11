import Image from "next/image"
import { notFound } from "next/navigation"
import { TourCard } from "@/components/tour-card"
import { getAllTours } from "@/lib/airtable"
import { getStoredRecords } from "@/lib/admin/sync-utils"
import { PostType, type Category } from "@/lib/types"

interface CategoryPageProps {
  params: { slug: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = getStoredRecords<Category>(PostType.CATEGORY)
  const category = categories.find((c) => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  const tours = await getAllTours()
  const categoryTours = tours.filter((tour) =>
    tour.categories?.some((cat) => typeof cat === "string" && cat.toLowerCase() === category.name.toLowerCase()),
  )

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[300px]">
        <Image
          src={category.image || "/placeholder.svg?height=300&width=1200"}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        {/* Description */}
        <div className="max-w-3xl mb-12">
          <p className="text-lg text-muted-foreground">
            {category.description || `Explore our amazing ${category.name.toLowerCase()} tours and activities.`}
          </p>
        </div>

        {/* Tours */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {category.name} Tours ({categoryTours.length})
          </h2>

          {categoryTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tours available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

