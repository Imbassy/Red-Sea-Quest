"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PostType } from "@/lib/types"
import { getFieldMappings } from "@/lib/admin/field-mapping"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FieldMappingCard() {
  const [selectedPostType, setSelectedPostType] = useState<PostType>(PostType.TOUR)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMapping, setNewMapping] = useState({
    airtableField: "",
    appField: "",
    type: "string" as const,
  })

  // Get field mappings for each post type
  const tourMappings = getFieldMappings(PostType.TOUR)
  const categoryMappings = getFieldMappings(PostType.CATEGORY)
  const destinationMappings = getFieldMappings(PostType.DESTINATION)

  // Count of mappings for each post type
  const mappingCounts = {
    [PostType.TOUR]: tourMappings.length,
    [PostType.CATEGORY]: categoryMappings.length,
    [PostType.DESTINATION]: destinationMappings.length,
  }

  // Get field mappings for the selected post type
  const selectedMappings = getFieldMappings(selectedPostType)

  // Handle quick add mapping
  const handleQuickAdd = () => {
    // In a real implementation, this would add the mapping to the store
    // For now, we'll just close the dialog
    setIsDialogOpen(false)
    setNewMapping({
      airtableField: "",
      appField: "",
      type: "string",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Field Mapping</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/field-mapping">
              <Settings className="mr-2 h-4 w-4" />
              Advanced Settings
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>Configure how Airtable fields map to your application data model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedPostType === PostType.TOUR ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPostType(PostType.TOUR)}
            >
              Tours ({mappingCounts[PostType.TOUR]})
            </Button>
            <Button
              variant={selectedPostType === PostType.CATEGORY ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPostType(PostType.CATEGORY)}
            >
              Categories ({mappingCounts[PostType.CATEGORY]})
            </Button>
            <Button
              variant={selectedPostType === PostType.DESTINATION ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPostType(PostType.DESTINATION)}
            >
              Destinations ({mappingCounts[PostType.DESTINATION]})
            </Button>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Current Mappings</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {selectedMappings.slice(0, 5).map((mapping, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="font-medium">{mapping.airtableField}</span>
                    <ArrowRight className="mx-2 h-3 w-3 text-muted-foreground" />
                    <span>{mapping.appField}</span>
                  </div>
                  <Badge variant="outline">{mapping.type}</Badge>
                </div>
              ))}
              {selectedMappings.length > 5 && (
                <div className="text-sm text-muted-foreground text-center pt-2">
                  + {selectedMappings.length - 5} more mappings
                </div>
              )}
              {selectedMappings.length === 0 && (
                <div className="text-sm text-muted-foreground">No mappings configured for this post type.</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Quick Add Mapping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Field Mapping</DialogTitle>
              <DialogDescription>Quickly add a new field mapping for {selectedPostType}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="airtable-field" className="text-right">
                  Airtable Field
                </Label>
                <Input
                  id="airtable-field"
                  placeholder="e.g. Name"
                  className="col-span-3"
                  value={newMapping.airtableField}
                  onChange={(e) => setNewMapping({ ...newMapping, airtableField: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="app-field" className="text-right">
                  App Field
                </Label>
                <Input
                  id="app-field"
                  placeholder="e.g. name"
                  className="col-span-3"
                  value={newMapping.appField}
                  onChange={(e) => setNewMapping({ ...newMapping, appField: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="field-type" className="text-right">
                  Field Type
                </Label>
                <Select
                  value={newMapping.type}
                  onValueChange={(value) => setNewMapping({ ...newMapping, type: value as any })}
                >
                  <SelectTrigger id="field-type" className="col-span-3">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="relation">Relation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleQuickAdd}>Add Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button asChild>
          <Link href="/admin/field-mapping">View All Mappings</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

