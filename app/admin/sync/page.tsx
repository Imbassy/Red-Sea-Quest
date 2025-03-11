"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { testAirtableConnection, syncPostTypeFromAirtable, syncAllFromAirtable } from "@/lib/admin/sync-utils"
import { PostType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"

export default function SyncPage() {
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean
    success?: boolean
    message?: string
  }>({ tested: false })

  const [syncStatus, setSyncStatus] = useState<{
    syncing: boolean
    completed: boolean
    success?: boolean
    message?: string
    results?: Record<PostType, { success: boolean; recordsProcessed: number }>
  }>({ syncing: false, completed: false })

  const handleTestConnection = async () => {
    setConnectionStatus({ tested: true })

    try {
      const result = await testAirtableConnection()
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.message,
      })
    } catch (error) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error testing connection",
      })
    }
  }

  const handleSyncAll = async () => {
    setSyncStatus({ syncing: true, completed: false })

    try {
      const result = await syncAllFromAirtable()
      setSyncStatus({
        syncing: false,
        completed: true,
        success: result.success,
        message: result.message,
        results: result.results,
      })
    } catch (error) {
      setSyncStatus({
        syncing: false,
        completed: true,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during sync",
      })
    }
  }

  const handleSyncPostType = async (postType: PostType) => {
    setSyncStatus({ syncing: true, completed: false })

    try {
      const result = await syncPostTypeFromAirtable(postType)

      // Create a results object with just this post type
      const results = {
        [PostType.TOUR]: { success: false, recordsProcessed: 0 },
        [PostType.CATEGORY]: { success: false, recordsProcessed: 0 },
        [PostType.DESTINATION]: { success: false, recordsProcessed: 0 },
      }

      results[postType] = {
        success: result.success,
        recordsProcessed: result.recordsProcessed || 0,
      }

      setSyncStatus({
        syncing: false,
        completed: true,
        success: result.success,
        message: result.message,
        results,
      })
    } catch (error) {
      setSyncStatus({
        syncing: false,
        completed: true,
        success: false,
        message: error instanceof Error ? error.message : `Unknown error syncing ${postType}`,
      })
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Airtable Sync</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>Test your connection to Airtable before syncing data.</CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus.tested && (
            <Alert className={connectionStatus.success ? "bg-green-50" : "bg-red-50"}>
              {connectionStatus.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>{connectionStatus.success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
              <AlertDescription>{connectionStatus.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4">
            <Button onClick={handleTestConnection}>Test Connection</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Post Types</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Sync All Post Types</CardTitle>
              <CardDescription>Sync all your data from Airtable to the application.</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus.completed && (
                <Alert className={syncStatus.success ? "bg-green-50" : "bg-red-50"}>
                  {syncStatus.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>{syncStatus.success ? "Sync Successful" : "Sync Failed"}</AlertTitle>
                  <AlertDescription>
                    {syncStatus.message}
                    {syncStatus.results && (
                      <div className="mt-2 space-y-1">
                        <p>Sync Results:</p>
                        <ul className="list-disc pl-5">
                          <li>
                            Tours: {syncStatus.results[PostType.TOUR].success ? "Success" : "Failed"}(
                            {syncStatus.results[PostType.TOUR].recordsProcessed} records)
                          </li>
                          <li>
                            Categories: {syncStatus.results[PostType.CATEGORY].success ? "Success" : "Failed"}(
                            {syncStatus.results[PostType.CATEGORY].recordsProcessed} records)
                          </li>
                          <li>
                            Destinations: {syncStatus.results[PostType.DESTINATION].success ? "Success" : "Failed"}(
                            {syncStatus.results[PostType.DESTINATION].recordsProcessed} records)
                          </li>
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Button onClick={handleSyncAll} disabled={syncStatus.syncing || !connectionStatus.success}>
                  {syncStatus.syncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync All Post Types"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tours">
          <Card>
            <CardHeader>
              <CardTitle>Sync Tours</CardTitle>
              <CardDescription>Sync only your tour data from Airtable to the application.</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus.completed && syncStatus.results && (
                <Alert className={syncStatus.results[PostType.TOUR].success ? "bg-green-50" : "bg-red-50"}>
                  {syncStatus.results[PostType.TOUR].success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>
                    {syncStatus.results[PostType.TOUR].success ? "Sync Successful" : "Sync Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {syncStatus.message}
                    {syncStatus.results[PostType.TOUR].recordsProcessed > 0 && (
                      <div className="mt-2">
                        Processed {syncStatus.results[PostType.TOUR].recordsProcessed} tour records.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => handleSyncPostType(PostType.TOUR)}
                  disabled={syncStatus.syncing || !connectionStatus.success}
                >
                  {syncStatus.syncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync Tours"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Sync Categories</CardTitle>
              <CardDescription>Sync only your category data from Airtable to the application.</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus.completed && syncStatus.results && (
                <Alert className={syncStatus.results[PostType.CATEGORY].success ? "bg-green-50" : "bg-red-50"}>
                  {syncStatus.results[PostType.CATEGORY].success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>
                    {syncStatus.results[PostType.CATEGORY].success ? "Sync Successful" : "Sync Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {syncStatus.message}
                    {syncStatus.results[PostType.CATEGORY].recordsProcessed > 0 && (
                      <div className="mt-2">
                        Processed {syncStatus.results[PostType.CATEGORY].recordsProcessed} category records.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => handleSyncPostType(PostType.CATEGORY)}
                  disabled={syncStatus.syncing || !connectionStatus.success}
                >
                  {syncStatus.syncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync Categories"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations">
          <Card>
            <CardHeader>
              <CardTitle>Sync Destinations</CardTitle>
              <CardDescription>Sync only your destination data from Airtable to the application.</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus.completed && syncStatus.results && (
                <Alert className={syncStatus.results[PostType.DESTINATION].success ? "bg-green-50" : "bg-red-50"}>
                  {syncStatus.results[PostType.DESTINATION].success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>
                    {syncStatus.results[PostType.DESTINATION].success ? "Sync Successful" : "Sync Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {syncStatus.message}
                    {syncStatus.results[PostType.DESTINATION].recordsProcessed > 0 && (
                      <div className="mt-2">
                        Processed {syncStatus.results[PostType.DESTINATION].recordsProcessed} destination records.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => handleSyncPostType(PostType.DESTINATION)}
                  disabled={syncStatus.syncing || !connectionStatus.success}
                >
                  {syncStatus.syncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Sync Destinations"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

