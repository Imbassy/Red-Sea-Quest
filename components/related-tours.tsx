import { TourCard } from "@/components/tour-card"
import { getAllTours } from "@/lib/airtable"

interface RelatedToursProps {
  currentTourId: string
}

export async function RelatedTours({ currentTourId }: RelatedToursProps) {
  const allTours = await getAllTours()
  const relatedTours = allTours.filter((tour) => tour.id !== currentTourId).slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedTours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  )
}

