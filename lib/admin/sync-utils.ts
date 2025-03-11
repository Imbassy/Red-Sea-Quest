import Airtable from "airtable"
import { type FieldMapping, getFieldMappings, getAirtableTableName } from "./field-mapping"
import { PostType } from "../types"
import { set } from "lodash"

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
})

// Function to test Airtable connection
export async function testAirtableConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const base = airtable.base(process.env.AIRTABLE_BASE_ID || "")
    const table = base.table(getAirtableTableName(PostType.TOUR))

    // Try to fetch a single record to test connection
    await table.select({ maxRecords: 1 }).firstPage()

    return {
      success: true,
      message: "Successfully connected to Airtable!",
    }
  } catch (error) {
    console.error("Error testing Airtable connection:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error connecting to Airtable",
    }
  }
}

// Function to sync data from Airtable for a specific post type
export async function syncPostTypeFromAirtable(postType: PostType): Promise<{
  success: boolean
  message: string
  recordsProcessed?: number
}> {
  try {
    const base = airtable.base(process.env.AIRTABLE_BASE_ID || "")
    const tableName = getAirtableTableName(postType)
    const table = base.table(tableName)

    // Get field mappings for this post type
    const fieldMappings = getFieldMappings(postType)

    // Fetch all records
    const records = await table.select().all()

    console.log(`Retrieved ${records.length} records from Airtable table ${tableName}`)

    // Process records
    const processedRecords = records.map((record) => {
      return processRecord(record, fieldMappings, postType)
    })

    console.log(`Processed ${processedRecords.length} ${postType} records`)

    // In a real app, you would save these to your database
    // For now, we'll store them in memory (this would be replaced with database operations)
    storeProcessedRecords(postType, processedRecords)

    return {
      success: true,
      message: `Successfully synced ${processedRecords.length} ${postType} records from Airtable`,
      recordsProcessed: processedRecords.length,
    }
  } catch (error) {
    console.error(`Error syncing ${postType} from Airtable:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : `Unknown error syncing ${postType} from Airtable`,
    }
  }
}

// Function to sync all post types from Airtable
export async function syncAllFromAirtable(): Promise<{
  success: boolean
  message: string
  results: Record<PostType, { success: boolean; recordsProcessed: number }>
}> {
  const results: Record<PostType, { success: boolean; recordsProcessed: number }> = {
    [PostType.TOUR]: { success: false, recordsProcessed: 0 },
    [PostType.CATEGORY]: { success: false, recordsProcessed: 0 },
    [PostType.DESTINATION]: { success: false, recordsProcessed: 0 },
  }

  let allSuccess = true

  // Sync categories first (they might be referenced by tours)
  const categoryResult = await syncPostTypeFromAirtable(PostType.CATEGORY)
  results[PostType.CATEGORY] = {
    success: categoryResult.success,
    recordsProcessed: categoryResult.recordsProcessed || 0,
  }
  allSuccess = allSuccess && categoryResult.success

  // Sync destinations next (they might be referenced by tours)
  const destinationResult = await syncPostTypeFromAirtable(PostType.DESTINATION)
  results[PostType.DESTINATION] = {
    success: destinationResult.success,
    recordsProcessed: destinationResult.recordsProcessed || 0,
  }
  allSuccess = allSuccess && destinationResult.success

  // Sync tours last (they reference categories and destinations)
  const tourResult = await syncPostTypeFromAirtable(PostType.TOUR)
  results[PostType.TOUR] = {
    success: tourResult.success,
    recordsProcessed: tourResult.recordsProcessed || 0,
  }
  allSuccess = allSuccess && tourResult.success

  const totalRecords = Object.values(results).reduce((sum, result) => sum + result.recordsProcessed, 0)

  return {
    success: allSuccess,
    message: allSuccess
      ? `Successfully synced ${totalRecords} records from Airtable`
      : "Some post types failed to sync. Check the detailed results.",
    results,
  }
}

// In-memory storage for processed records (would be replaced with database in real app)
const inMemoryStore: Record<PostType, any[]> = {
  [PostType.TOUR]: [],
  [PostType.CATEGORY]: [],
  [PostType.DESTINATION]: [],
}

// Function to store processed records (would be replaced with database operations)
function storeProcessedRecords(postType: PostType, records: any[]): void {
  inMemoryStore[postType] = records
}

// Function to get stored records (would be replaced with database queries)
export function getStoredRecords<T>(postType: PostType): T[] {
  return inMemoryStore[postType] as T[]
}

// Helper function to process a record using field mappings
function processRecord(record: any, fieldMappings: FieldMapping[], postType: PostType): any {
  const result: any = {
    id: record.id,
    createdAt: record._rawJson.createdTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fieldMappings.forEach((mapping) => {
    const value = record.get(mapping.airtableField)

    if (value === undefined || value === null) {
      // For nested properties (like location.latitude), we need to use lodash's set
      if (mapping.appField.includes(".")) {
        set(result, mapping.appField, mapping.defaultValue)
      } else {
        result[mapping.appField] = mapping.defaultValue
      }
      return
    }

    switch (mapping.type) {
      case "string":
        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, String(value))
        } else {
          result[mapping.appField] = String(value)
        }
        break

      case "number":
        let parsedNumber
        if (typeof value === "string") {
          // Extract numbers from strings like "$45.00"
          const matches = value.match(/\d+(\.\d+)?/)
          parsedNumber = matches && matches[0] ? Number.parseFloat(matches[0]) : mapping.defaultValue
        } else {
          parsedNumber = typeof value === "number" && !isNaN(value) ? value : mapping.defaultValue
        }

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, parsedNumber)
        } else {
          result[mapping.appField] = parsedNumber
        }
        break

      case "boolean":
        const boolValue = value === true || value === "true" || value === 1 || value === "1"

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, boolValue)
        } else {
          result[mapping.appField] = boolValue
        }
        break

      case "array":
        let arrayValue
        if (typeof value === "string") {
          arrayValue = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        } else if (Array.isArray(value)) {
          arrayValue = value
        } else {
          arrayValue = mapping.defaultValue
        }

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, arrayValue)
        } else {
          result[mapping.appField] = arrayValue
        }
        break

      case "image":
        let imageValue = ""
        if (typeof value === "string" && value.includes("http")) {
          imageValue = value
        } else if (Array.isArray(value) && value[0]?.url) {
          imageValue = value[0].url
        } else if (value?.url) {
          imageValue = value.url
        } else {
          imageValue = mapping.defaultValue
        }

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, imageValue)
        } else {
          result[mapping.appField] = imageValue
        }
        break

      case "date":
        let dateValue
        if (value instanceof Date) {
          dateValue = value.toISOString()
        } else if (typeof value === "string") {
          dateValue = value
        } else {
          dateValue = mapping.defaultValue
        }

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, dateValue)
        } else {
          result[mapping.appField] = dateValue
        }
        break

      case "relation":
        // Handle relation fields (IDs of related records)
        let relationValue
        if (Array.isArray(value)) {
          // For many-to-many relations
          relationValue = value
        } else if (value) {
          // For one-to-many relations
          relationValue = value
        } else {
          relationValue = mapping.defaultValue
        }

        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, relationValue)
        } else {
          result[mapping.appField] = relationValue
        }
        break

      case "object":
        // For object fields, we just pass through the value
        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, value)
        } else {
          result[mapping.appField] = value
        }
        break

      default:
        // For nested properties
        if (mapping.appField.includes(".")) {
          set(result, mapping.appField, value)
        } else {
          result[mapping.appField] = value
        }
    }
  })

  return result
}

