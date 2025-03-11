import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTours } from "@/lib/airtable"
import { Settings, RefreshCw, Database, Map, Tag, LayoutDashboard } from "lucide-react"
import { getStoredRecords } from "@/lib/admin/sync-utils"
import { PostType, type Category, type Destination } from "@/lib/types"
import { QuickSyncButton } from "@/components/admin/quick-sync-button"
import { FieldMappingCard } from "@/components/admin/field-mapping-card"

export default async function AdminPage() {
  const tours = await getAllTours()

  // In a real app, these would come from your database
  // For now, we'll use the in-memory store from sync-utils
  const categories = getStoredRecords<Category>(PostType.CATEGORY)
  const destinations = getStoredRecords<Destination>(PostType.DESTINATION)

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <QuickSyncButton />
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/sync">
              <Settings className="mr-2 h-4 w-4" />
              Sync Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{tours.filter((t) => t.featured).length} featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Used to organize tours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Locations for tours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="tours">
            <Tag className="h-4 w-4 mr-2" />
            Tours
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="destinations">
            <Map className="h-4 w-4 mr-2" />
            Destinations
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldMappingCard />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild className="w-full">
                    <Link href="/admin/sync">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Data
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/admin/field-mapping">
                      <Database className="mr-2 h-4 w-4" />
                      Field Mapping
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add New Tour
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add New Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tours</CardTitle>
                <CardDescription>Recently added or updated tours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tours.slice(0, 5).map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{tour.name}</p>
                        <p className="text-sm text-muted-foreground">{tour.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${typeof tour.price === "number" ? tour.price.toFixed(2) : "0.00"}
                        </p>
                        <p className="text-sm text-muted-foreground">{tour.duration}</p>
                      </div>
                    </div>
                  ))}
                  {tours.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No tours found. Sync your data from Airtable.
                    </p>
                  )}
                </div>
                {tours.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="#tours">View All Tours</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tours" className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Tours</h2>
            <Button>Add New Tour</Button>
          </div>

          <div className="grid gap-4">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <Card key={tour.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{tour.name}</CardTitle>
                        <CardDescription>{tour.location}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p>
                          <strong>Price:</strong> ${typeof tour.price === "number" ? tour.price.toFixed(2) : "0.00"}
                        </p>
                        <p>
                          <strong>Duration:</strong> {tour.duration}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Rating:</strong> {typeof tour.rating === "number" ? tour.rating.toFixed(1) : "4.5"} (
                          {tour.reviewCount} reviews)
                        </p>
                        <p>
                          <strong>Status:</strong> {tour.featured ? "Featured" : "Regular"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      No tours found. Sync your data from Airtable or add a new tour.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild>
                        <Link href="/admin/sync">Sync from Airtable</Link>
                      </Button>
                      <Button variant="outline">Add New Tour</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Categories</h2>
            <Button>Add New Category</Button>
          </div>

          <div className="grid gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>Slug: {category.slug}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p>
                          <strong>Description:</strong> {category.description || "No description"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Featured Order:</strong> {category.featuredOrder || "Not featured"}
                        </p>
                        <p>
                          <strong>Tour Count:</strong> {category.tourCount || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      No categories found. Sync your data from Airtable or add a new category.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild>
                        <Link href="/admin/sync">Sync from Airtable</Link>
                      </Button>
                      <Button variant="outline">Add New Category</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Destinations</h2>
            <Button>Add New Destination</Button>
          </div>

          <div className="grid gap-4">
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <Card key={destination.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{destination.name}</CardTitle>
                        <CardDescription>Slug: {destination.slug}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p>
                          <strong>Description:</strong> {destination.description || "No description"}
                        </p>
                        {destination.location?.address && (
                          <p>
                            <strong>Address:</strong> {destination.location.address}
                          </p>
                        )}
                      </div>
                      <div>
                        <p>
                          <strong>Featured Order:</strong> {destination.featuredOrder || "Not featured"}
                        </p>
                        <p>
                          <strong>Tour Count:</strong> {destination.tourCount || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      No destinations found. Sync your data from Airtable or add a new destination.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild>
                        <Link href="/admin/sync">Sync from Airtable</Link>
                      </Button>
                      <Button variant="outline">Add New Destination</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Airtable Sync</CardTitle>
                <CardDescription>Sync your data from Airtable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Last Sync</p>
                    <p className="text-sm text-muted-foreground">Today at 10:45 AM</p>
                  </div>
                  <Button asChild>
                    <Link href="/admin/sync">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Field Mapping</CardTitle>
                <CardDescription>Configure how Airtable fields map to your app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Configuration</p>
                    <p className="text-sm text-muted-foreground">Multiple post types configured</p>
                  </div>
                  <Button asChild>
                    <Link href="/admin/field-mapping">
                      <Database className="mr-2 h-4 w-4" />
                      Configure Mapping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Tours
                </CardTitle>
                <CardDescription>Manage tour data sync</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/sync?tab=tours">Sync Tours</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Categories
                </CardTitle>
                <CardDescription>Manage category data sync</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/sync?tab=categories">Sync Categories</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="mr-2 h-5 w-5" />
                  Destinations
                </CardTitle>
                <CardDescription>Manage destination data sync</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/sync?tab=destinations">Sync Destinations</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Airtable Sync Settings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Airtable Connection</CardTitle>
              <CardDescription>Manage your Airtable connection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Connection Status</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Connected</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/admin/sync">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/field-mapping">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Fields
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

