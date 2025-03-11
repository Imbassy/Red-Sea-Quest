"use server"

import { revalidatePath } from "next/cache"
import Airtable from "airtable"
import { syncToursFromAirtable, getSyncStatus } from "./airtable"

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
})

const base = airtable.base(process.env.AIRTABLE_BASE_ID || "")
const bookingsTable = base.table(process.env.AIRTABLE_BOOKINGS_TABLE || "Bookings")

interface BookingData {
  tourId: string
  date: string
  adults: number
  children: number
}

export async function createBooking(data: BookingData) {
  try {
    await bookingsTable.create({
      TourId: data.tourId,
      Date: data.date,
      Adults: data.adults,
      Children: data.children,
      Status: "Confirmed",
      BookedAt: new Date().toISOString(),
    })

    revalidatePath(`/tours/${data.tourId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

// Manual sync action
export async function manualSync() {
  const result = await syncToursFromAirtable()

  // Revalidate all tour-related pages
  revalidatePath("/")
  revalidatePath("/tours")
  revalidatePath("/admin")

  return result
}

// Get sync status
export async function getSyncInfo() {
  const status = getSyncStatus()

  return {
    lastSync: status.lastSyncTime ? status.lastSyncTime.toISOString() : null,
    isSyncing: status.isSyncing,
    tourCount: status.tourCount,
  }
}

