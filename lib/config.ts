// Field mapping configuration
export const fieldMapping = {
  // Tour fields
  name: ["Name", "name", "title", "Title"],
  location: ["Location", "location"],
  price: ["Price", "price", "cost", "Cost"],
  duration: ["Duration", "duration"],
  rating: ["Rating", "rating", "Average Rating"],
  reviewCount: ["Review Count", "reviewCount", "review_count", "Total Reviews"],
  image: ["Image", "image", "photo", "Photo", "Images"],
  shortDescription: ["Short Description", "shortDescription", "short_description", "summary", "Summary"],
  description: ["Description", "description"],
  details: ["Details", "details"],
  featured: ["Featured", "featured", "is_featured", "IsFeatured"],
  maxGroupSize: ["Max Group Size", "maxGroupSize", "max_group_size", "group_size"],
  availability: ["Availability", "availability", "Availability Summary"],
  included: ["Included", "included", "whats_included"],
  categories: ["Categories", "categories", "category", "Category", "Category Summary"],
  itinerary: ["Itinerary", "itinerary"],
  reviews: ["Reviews", "reviews"],
}

// Default values for tour fields
export const defaultValues = {
  name: "Unnamed Tour",
  location: "Red Sea, Egypt",
  price: 0,
  duration: "1 day",
  rating: 4.5,
  reviewCount: 0,
  image: "",
  shortDescription: "Experience this amazing tour in the Red Sea region.",
  description: "",
  details: "",
  featured: false,
  maxGroupSize: 10,
  availability: "Daily",
  included: ["Professional guide", "Transportation", "Snacks and drinks"],
  categories: [],
  itinerary: [
    { title: "Start of Tour", description: "Meet your guide and begin your adventure." },
    { title: "Main Activity", description: "Experience the highlight of this tour." },
    { title: "End of Tour", description: "Return to your starting point with amazing memories." },
  ],
  reviews: [
    {
      name: "John Doe",
      rating: 5,
      date: "Last month",
      comment: "Amazing experience! Would definitely recommend.",
    },
  ],
}

