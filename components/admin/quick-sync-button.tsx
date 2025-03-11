"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, AlertCircle } from "lucide-react"
import { syncAllFromAirtable } from "@/lib/admin/sync-utils"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function QuickSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<{
    success?: boolean
    timestamp?: Date
    recordCount?: number
  }>({})

  const handleSync = async () => {
    setIsSyncing(true)

    try {
      const result = await syncAllFromAirtable()

      const totalRecords = Object.values(result.results).reduce((sum, result) => sum + result.recordsProcessed, 0)

      setLastSyncResult({
        success: result.success,
        timestamp: new Date(),
        recordCount: totalRecords,
      })

      if (result.success) {
        toast({
          title: "Sync Successful",
          description: `Successfully synced ${totalRecords} records from Airtable.`,
        })
      } else {
        toast({
          title: "Sync Partially Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      setLastSyncResult({
        success: false,
        timestamp: new Date(),
      })

      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Unknown error during sync",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="relative" size="sm">
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Quick Sync
              </>
            )}

            {lastSyncResult.success !== undefined && !isSyncing && (
              <div className="absolute -top-1 -right-1">
                {lastSyncResult.success ? (
                  <div className="bg-green-500 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-0.5">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {lastSyncResult.timestamp ? (
            <>
              Last sync: {lastSyncResult.timestamp.toLocaleTimeString()}
              {lastSyncResult.recordCount !== undefined && <> | {lastSyncResult.recordCount} records</>}
            </>
          ) : (
            "Sync all content from Airtable"
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

