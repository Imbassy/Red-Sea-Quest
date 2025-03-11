"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, MinusCircle, PlusCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createBooking } from "@/lib/actions"

interface BookingFormProps {
  tourId: string
}

export function BookingForm({ tourId }: BookingFormProps) {
  const [date, setDate] = useState<Date>()
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) return

    setLoading(true)

    try {
      await createBooking({
        tourId,
        date: format(date, "yyyy-MM-dd"),
        adults,
        children,
      })

      setSuccess(true)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <h3 className="text-xl font-semibold text-green-600 mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground mb-4">
          Your booking has been successfully processed. Check your email for details.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSuccess(false)
            setDate(undefined)
          }}
        >
          Book Another Tour
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Guests</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Adults</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAdults(adults + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Children (0-12 years)</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setChildren(children + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!date || loading}>
          {loading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </form>
  )
}

