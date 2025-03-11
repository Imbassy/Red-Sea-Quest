"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { manualSync, getSyncInfo } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [tourCount, setTourCount] = useState(0)
  const { toast } = useToast()

  // Fetch initial sync status
  useEffect(() => {
    async function fetchSyncStatus() {
      const status = await getSyncInfo()
      setLastSync(status.lastSync)
      setIsSyncing(status.isSyncing)
      setTourCount(status.tourCount)
    }

    fetchSyncStatus()
  }, [])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle sync button click
  const handleSync = async () => {
    setIsSyncing(true)

    try {
      const result = await manualSync()

      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `${result.count} tours synced from Airtable.`,
        })

        // Update status
        const status = await getSyncInfo()
        setLastSync(status.lastSync)
        setTourCount(status.tourCount)
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={handleSync} disabled={isSyncing} className="w-full">
        {isSyncing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync with Airtable
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground">
        <div>Last sync: {formatDate(lastSync)}</div>
        <div>Tours: {tourCount}</div>
      </div>
    </div>
  )
}

