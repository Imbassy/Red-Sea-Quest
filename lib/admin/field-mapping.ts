import { PostType } from "../types"

// Field mapping configuration for Airtable integration
export interface FieldMapping {
  postType: PostType
  airtableField: string
  appField: string
  type: "string" | "number" | "boolean" | "array" | "image" | "date" | "object" | "relation"
  required: boolean
  defaultValue?: any
  relationTable?: string // For relation fields
  relationDisplayField?: string // For relation fields
}

// Default field mappings for Tours
export const defaultTourMappings: FieldMapping[] = [
  {
    postType: PostType.TOUR,
    airtableField: "Name",
    appField: "name",
    type: "string",
    required: true,
    defaultValue: "Unnamed Tour",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Location",
    appField: "location",
    type: "string",
    required: false,
    defaultValue: "Red Sea, Egypt",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Price",
    appField: "price",
    type: "number",
    required: false,
    defaultValue: 0,
  },
  {
    postType: PostType.TOUR,
    airtableField: "Duration",
    appField: "duration",
    type: "string",
    required: false,
    defaultValue: "1 day",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Rating",
    appField: "rating",
    type: "number",
    required: false,
    defaultValue: 4.5,
  },
  {
    postType: PostType.TOUR,
    airtableField: "Review Count",
    appField: "reviewCount",
    type: "number",
    required: false,
    defaultValue: 0,
  },
  {
    postType: PostType.TOUR,
    airtableField: "Image",
    appField: "image",
    type: "image",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Short Description",
    appField: "shortDescription",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Description",
    appField: "description",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Details",
    appField: "details",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Featured",
    appField: "featured",
    type: "boolean",
    required: false,
    defaultValue: false,
  },
  {
    postType: PostType.TOUR,
    airtableField: "Max Group Size",
    appField: "maxGroupSize",
    type: "number",
    required: false,
    defaultValue: 10,
  },
  {
    postType: PostType.TOUR,
    airtableField: "Availability",
    appField: "availability",
    type: "string",
    required: false,
    defaultValue: "Daily",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Included",
    appField: "included",
    type: "array",
    required: false,
    defaultValue: [],
  },
  {
    postType: PostType.TOUR,
    airtableField: "Categories",
    appField: "categories",
    type: "relation",
    required: false,
    defaultValue: [],
    relationTable: "Categories",
    relationDisplayField: "Name",
  },
  {
    postType: PostType.TOUR,
    airtableField: "Destination",
    appField: "destinationId",
    type: "relation",
    required: false,
    defaultValue: "",
    relationTable: "Destinations",
    relationDisplayField: "Name",
  },
]

// Default field mappings for Categories
export const defaultCategoryMappings: FieldMapping[] = [
  {
    postType: PostType.CATEGORY,
    airtableField: "Name",
    appField: "name",
    type: "string",
    required: true,
    defaultValue: "Unnamed Category",
  },
  {
    postType: PostType.CATEGORY,
    airtableField: "Slug",
    appField: "slug",
    type: "string",
    required: true,
    defaultValue: "",
  },
  {
    postType: PostType.CATEGORY,
    airtableField: "Description",
    appField: "description",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.CATEGORY,
    airtableField: "Image",
    appField: "image",
    type: "image",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.CATEGORY,
    airtableField: "Featured Order",
    appField: "featuredOrder",
    type: "number",
    required: false,
    defaultValue: 0,
  },
  {
    postType: PostType.CATEGORY,
    airtableField: "Parent Category",
    appField: "parentId",
    type: "relation",
    required: false,
    defaultValue: "",
    relationTable: "Categories",
    relationDisplayField: "Name",
  },
]

// Default field mappings for Destinations
export const defaultDestinationMappings: FieldMapping[] = [
  {
    postType: PostType.DESTINATION,
    airtableField: "Name",
    appField: "name",
    type: "string",
    required: true,
    defaultValue: "Unnamed Destination",
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Slug",
    appField: "slug",
    type: "string",
    required: true,
    defaultValue: "",
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Description",
    appField: "description",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Image",
    appField: "image",
    type: "image",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Latitude",
    appField: "location.latitude",
    type: "number",
    required: false,
    defaultValue: null,
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Longitude",
    appField: "location.longitude",
    type: "number",
    required: false,
    defaultValue: null,
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Address",
    appField: "location.address",
    type: "string",
    required: false,
    defaultValue: "",
  },
  {
    postType: PostType.DESTINATION,
    airtableField: "Featured Order",
    appField: "featuredOrder",
    type: "number",
    required: false,
    defaultValue: 0,
  },
]

// Combine all default mappings
export const defaultFieldMappings: FieldMapping[] = [
  ...defaultTourMappings,
  ...defaultCategoryMappings,
  ...defaultDestinationMappings,
]

// Function to get field mappings from local storage or use defaults
export function getFieldMappings(postType?: PostType): FieldMapping[] {
  if (typeof window === "undefined") {
    return postType ? defaultFieldMappings.filter((mapping) => mapping.postType === postType) : defaultFieldMappings
  }

  const savedMappings = localStorage.getItem("airtableFieldMappings")
  if (savedMappings) {
    try {
      const mappings = JSON.parse(savedMappings) as FieldMapping[]
      return postType ? mappings.filter((mapping) => mapping.postType === postType) : mappings
    } catch (e) {
      console.error("Error parsing saved field mappings:", e)
      return postType ? defaultFieldMappings.filter((mapping) => mapping.postType === postType) : defaultFieldMappings
    }
  }

  return postType ? defaultFieldMappings.filter((mapping) => mapping.postType === postType) : defaultFieldMappings
}

// Function to save field mappings to local storage
export function saveFieldMappings(mappings: FieldMapping[]): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem("airtableFieldMappings", JSON.stringify(mappings))
}

// Function to get Airtable table name for a post type
export function getAirtableTableName(postType: PostType): string {
  switch (postType) {
    case PostType.TOUR:
      return process.env.AIRTABLE_TOURS_TABLE || "Tours"
    case PostType.CATEGORY:
      return process.env.AIRTABLE_CATEGORIES_TABLE || "Categories"
    case PostType.DESTINATION:
      return process.env.AIRTABLE_DESTINATIONS_TABLE || "Destinations"
    default:
      return "Tours"
  }
}

