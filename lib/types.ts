// Base type for all post types
export interface BasePost {
  id: string
  createdAt: string
  updatedAt: string
}

// Tour type
export interface Tour extends BasePost {
  name: string
  location: string
  price: number
  duration: string
  rating: number
  reviewCount: number
  image: string
  shortDescription: string
  description: string
  details: string
  featured: boolean
  maxGroupSize: number
  availability: string
  included: string[]
  itinerary: {
    title: string
    description: string
  }[]
  reviews: {
    name: string
    rating: number
    date: string
    comment: string
  }[]
  categories: string[]
  destinationId?: string
}

// Category type
export interface Category extends BasePost {
  name: string
  slug: string
  description: string
  image: string
  featuredOrder?: number
  parentId?: string
  tourCount?: number
}

// Destination type
export interface Destination extends BasePost {
  name: string
  slug: string
  description: string
  image: string
  location: {
    latitude?: number
    longitude?: number
    address?: string
  }
  featuredOrder?: number
  tourCount?: number
}

// Post type enum for field mapping
export enum PostType {
  TOUR = "tour",
  CATEGORY = "category",
  DESTINATION = "destination",
}

