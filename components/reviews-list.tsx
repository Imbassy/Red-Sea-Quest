"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  name: string
  rating: number
  date: string
  comment: string
}

interface ReviewsListProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export function ReviewsList({ reviews, rating, reviewCount }: ReviewsListProps) {
  const [sortBy, setSortBy] = useState("recent")

  const ratingPercentages = {
    5: (reviews.filter((r) => r.rating === 5).length / reviews.length) * 100,
    4: (reviews.filter((r) => r.rating === 4).length / reviews.length) * 100,
    3: (reviews.filter((r) => r.rating === 3).length / reviews.length) * 100,
    2: (reviews.filter((r) => r.rating === 2).length / reviews.length) * 100,
    1: (reviews.filter((r) => r.rating === 1).length / reviews.length) * 100,
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">out of 5</span>
            </div>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Based on {reviewCount} reviews</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex items-center min-w-[60px]">
                  {stars} <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${ratingPercentages[stars as keyof typeof ratingPercentages]}%` }}
                  />
                </div>
                <div className="min-w-[40px] text-sm text-muted-foreground">
                  {Math.round(ratingPercentages[stars as keyof typeof ratingPercentages])}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{review.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{review.comment}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </div>
  )
}

