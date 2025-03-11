import Airtable from "airtable"
import type { Tour } from "./types"
import { fieldMapping, defaultValues } from "./config"

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
})

const base = airtable.base(process.env.AIRTABLE_BASE_ID || "")
const toursTable = base.table(process.env.AIRTABLE_TOURS_TABLE || "toursTours-Grid view")

// Store the last sync time
let lastSyncTime: Date | null = null
let cachedTours: Tour[] = []
let isSyncing = false

// Helper function to find a field value using the field mapping
function findFieldValue(record: any, fieldKey: keyof typeof fieldMapping): any {
  const possibleFields = fieldMapping[fieldKey]

  for (const field of possibleFields) {
    const value = record.get(field)
    if (value !== undefined && value !== null) {
      return value
    }
  }

  return null
}

// Helper function to parse price from string (e.g., "$45.00" to 45)
function parsePrice(priceString: any): number {
  if (!priceString) return 0

  // If it's already a number
  if (typeof priceString === "number") return priceString

  // If it's a string
  if (typeof priceString === "string") {
    // Extract numbers from the string
    const matches = priceString.match(/\d+(\.\d+)?/)
    if (matches && matches[0]) {
      return Number.parseFloat(matches[0])
    }
  }

  return 0
}

// Helper function to parse boolean values
function parseBoolean(value: any): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1"
  }
  return false
}

// Helper function to parse arrays or comma-separated strings
function parseArray(value: any, separator = ","): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

// Helper function to extract image URL from various formats
function extractImageUrl(imageField: any): string {
  if (!imageField) return ""

  // If it's a string URL
  if (typeof imageField === "string" && (imageField.startsWith("http") || imageField.startsWith("/"))) {
    return imageField
  }

  // If it's an array of attachments
  if (Array.isArray(imageField) && imageField.length > 0) {
    const firstItem = imageField[0]
    if (typeof firstItem === "string" && firstItem.startsWith("http")) {
      return firstItem
    }
    if (firstItem && firstItem.url) {
      return firstItem.url
    }
  }

  // If it's a single attachment object
  if (imageField && typeof imageField === "object" && imageField.url) {
    return imageField.url
  }

  return ""
}

// Update the parseRating function to ensure it never returns NaN
function parseRating(rating: any): number {
  if (!rating) return 4.5

  // If it's a string that can be converted to a number
  if (typeof rating === "string") {
    const parsed = Number.parseFloat(rating)
    return isNaN(parsed) ? 4.5 : parsed
  }

  // If it's already a number
  if (typeof rating === "number") {
    return isNaN(rating) ? 4.5 : rating
  }

  // Default rating
  return 4.5
}

// Update the recordToTour function to ensure all numeric values are valid
function recordToTour(record: any): Tour {
  try {
    // Helper function to get a field value with a default
    const getFieldValue = (record: any, fieldName: string, defaultValue: any) => {
      const value = record.get(fieldName)
      return value !== undefined && value !== null ? value : defaultValue
    }

    // Get values using the exact field names from the schema
    const name = getFieldValue(record, "Name", "Unnamed Tour")
    const location = getFieldValue(record, "Location", "Red Sea, Egypt")
    const priceString = getFieldValue(record, "Price", "$0")
    const price = parsePrice(priceString)
    const duration = getFieldValue(record, "Duration", "1 day")
    const rating = parseRating(getFieldValue(record, "Rating", 4.5))

    // Ensure reviewCount is a valid number
    let reviewCount = 0
    const reviewCountValue = getFieldValue(record, "Review Count", 0)
    if (typeof reviewCountValue === "string") {
      const parsed = Number.parseInt(reviewCountValue)
      reviewCount = isNaN(parsed) ? 0 : parsed
    } else if (typeof reviewCountValue === "number") {
      reviewCount = isNaN(reviewCountValue) ? 0 : reviewCountValue
    }

    // Handle image
    const imageField = findFieldValue(record, "image")
    const image = extractImageUrl(imageField)

    const shortDescription = findFieldValue(record, "shortDescription") || defaultValues.shortDescription
    const description = findFieldValue(record, "description") || defaultValues.description
    const details = findFieldValue(record, "details") || defaultValues.details

    // Parse featured field
    const featuredRaw = findFieldValue(record, "featured")
    const featured = parseBoolean(featuredRaw)

    // Parse max group size
    const maxGroupSizeRaw = findFieldValue(record, "maxGroupSize")
    const maxGroupSize = maxGroupSizeRaw ? Number.parseInt(String(maxGroupSizeRaw)) : defaultValues.maxGroupSize

    const availability = findFieldValue(record, "availability") || defaultValues.availability

    // Parse included items
    const includedRaw = findFieldValue(record, "included")
    const included = includedRaw ? parseArray(includedRaw) : defaultValues.included

    // Parse categories
    const categoriesRaw = findFieldValue(record, "categories")
    const categories = categoriesRaw ? parseArray(categoriesRaw) : defaultValues.categories

    // Parse itinerary
    const itineraryRaw = findFieldValue(record, "itinerary")
    const itinerary =
      itineraryRaw && Array.isArray(itineraryRaw) && itineraryRaw.length > 0 ? itineraryRaw : defaultValues.itinerary

    // Parse reviews
    const reviewsRaw = findFieldValue(record, "reviews")
    const reviews =
      reviewsRaw && Array.isArray(reviewsRaw) && reviewsRaw.length > 0 ? reviewsRaw : defaultValues.reviews

    return {
      id: record.id,
      name,
      location,
      price,
      duration,
      rating,
      reviewCount,
      image,
      shortDescription,
      description,
      details,
      featured,
      maxGroupSize,
      availability,
      included,
      itinerary,
      reviews,
      categories,
    }
  } catch (error) {
    console.error("Error converting Airtable record to Tour:", error)
    console.error("Record ID:", record.id)

    // Return a default tour with the record ID
    return {
      id: record.id,
      ...defaultValues,
      name: `Tour ${record.id.slice(0, 5)}`,
    }
  }
}

// Sync all tours from Airtable
export async function syncToursFromAirtable(): Promise<{ success: boolean; message: string; count: number }> {
  if (isSyncing) {
    return { success: false, message: "Sync already in progress", count: 0 }
  }

  isSyncing = true

  try {
    console.log("Starting Airtable sync...")

    // Fetch all records from Airtable
    const records = await toursTable.select().all()
    console.log(`Retrieved ${records.length} records from Airtable`)

    // Convert records to Tour objects
    const tours = records.map(recordToTour)

    // Update cache
    cachedTours = tours
    lastSyncTime = new Date()

    console.log(`Sync completed successfully. Processed ${tours.length} tours.`)
    return {
      success: true,
      message: `Successfully synced ${tours.length} tours`,
      count: tours.length,
    }
  } catch (error) {
    console.error("Error syncing tours from Airtable:", error)
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      count: 0,
    }
  } finally {
    isSyncing = false
  }
}

// Get all tours (from cache or sync if needed)
export async function getAllTours(category?: string): Promise<Tour[]> {
  // If cache is empty, sync from Airtable
  if (cachedTours.length === 0) {
    await syncToursFromAirtable()
  }

  // Filter by category if specified
  if (category) {
    return cachedTours.filter((tour) => {
      return tour.categories.some(
        (cat) => typeof cat === "string" && cat.toLowerCase().includes(category.toLowerCase()),
      )
    })
  }

  return cachedTours
}

// Get featured tours
export async function getFeaturedTours(): Promise<Tour[]> {
  // If cache is empty, sync from Airtable
  if (cachedTours.length === 0) {
    await syncToursFromAirtable()
  }

  // Filter featured tours
  const featuredTours = cachedTours.filter((tour) => tour.featured)

  // If we have featured tours, return them (limited to 8)
  if (featuredTours.length > 0) {
    return featuredTours.slice(0, 8)
  }

  // If no featured tours, return the first 8 tours
  return cachedTours.slice(0, 8)
}

// Get tour by ID
export async function getTourById(id: string): Promise<Tour | null> {
  // If cache is empty, sync from Airtable
  if (cachedTours.length === 0) {
    await syncToursFromAirtable()
  }

  // Find tour in cache
  const tour = cachedTours.find((tour) => tour.id === id)

  if (tour) {
    return tour
  }

  // If not found in cache, try to fetch directly
  try {
    const record = await toursTable.find(id)
    return recordToTour(record)
  } catch (error) {
    console.error(`Error fetching tour ${id} from Airtable:`, error)
    return null
  }
}

// Get sync status
export function getSyncStatus() {
  return {
    lastSyncTime,
    isSyncing,
    tourCount: cachedTours.length,
  }
}

