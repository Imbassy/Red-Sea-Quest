"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  defaultFieldMappings,
  defaultTourMappings,
  defaultCategoryMappings,
  defaultDestinationMappings,
  type FieldMapping,
  getFieldMappings,
  saveFieldMappings,
} from "@/lib/admin/field-mapping"
import { PostType } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function FieldMappingPage() {
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [activeTab, setActiveTab] = useState<PostType>(PostType.TOUR)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load field mappings
    const mappings = getFieldMappings()
    setFieldMappings(mappings)
    setIsLoading(false)
  }, [])

  const handleSave = () => {
    saveFieldMappings(fieldMappings)
    toast({
      title: "Field mappings saved",
      description: "Your field mappings have been saved successfully.",
    })
  }

  const handleReset = () => {
    setFieldMappings(defaultFieldMappings)
    toast({
      title: "Field mappings reset",
      description: "Your field mappings have been reset to defaults.",
    })
  }

  const handleResetPostType = (postType: PostType) => {
    let defaultMappings: FieldMapping[] = []

    switch (postType) {
      case PostType.TOUR:
        defaultMappings = defaultTourMappings
        break
      case PostType.CATEGORY:
        defaultMappings = defaultCategoryMappings
        break
      case PostType.DESTINATION:
        defaultMappings = defaultDestinationMappings
        break
    }

    // Replace only the mappings for this post type
    const newMappings = [...fieldMappings.filter((mapping) => mapping.postType !== postType), ...defaultMappings]

    setFieldMappings(newMappings)

    toast({
      title: `${postType} field mappings reset`,
      description: `Your ${postType} field mappings have been reset to defaults.`,
    })
  }

  const updateMapping = (index: number, field: keyof FieldMapping, value: any) => {
    const newMappings = [...fieldMappings]
    newMappings[index] = { ...newMappings[index], [field]: value }
    setFieldMappings(newMappings)
  }

  const addNewMapping = (postType: PostType) => {
    setFieldMappings([
      ...fieldMappings,
      {
        postType,
        airtableField: "",
        appField: "",
        type: "string",
        required: false,
        defaultValue: "",
      },
    ])
  }

  const removeMapping = (index: number) => {
    const newMappings = [...fieldMappings]
    newMappings.splice(index, 1)
    setFieldMappings(newMappings)
  }

  if (isLoading) {
    return <div className="container py-10">Loading...</div>
  }

  // Filter mappings by post type
  const tourMappings = fieldMappings.filter((mapping) => mapping.postType === PostType.TOUR)
  const categoryMappings = fieldMappings.filter((mapping) => mapping.postType === PostType.CATEGORY)
  const destinationMappings = fieldMappings.filter((mapping) => mapping.postType === PostType.DESTINATION)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Field Mapping Configuration</h1>

      <Tabs defaultValue={PostType.TOUR} onValueChange={(value) => setActiveTab(value as PostType)}>
        <TabsList className="mb-6">
          <TabsTrigger value={PostType.TOUR}>Tours</TabsTrigger>
          <TabsTrigger value={PostType.CATEGORY}>Categories</TabsTrigger>
          <TabsTrigger value={PostType.DESTINATION}>Destinations</TabsTrigger>
        </TabsList>

        <TabsContent value={PostType.TOUR}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tour Field Mappings</CardTitle>
              <CardDescription>
                Configure how fields from your Airtable Tours table map to the application's Tour model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tourMappings.map((mapping, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                    <div className="col-span-3">
                      <Label htmlFor={`airtable-field-${index}`}>Airtable Field</Label>
                      <Input
                        id={`airtable-field-${index}`}
                        value={mapping.airtableField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "airtableField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Name"
                      />
                    </div>

                    <div className="col-span-3">
                      <Label htmlFor={`app-field-${index}`}>App Field</Label>
                      <Input
                        id={`app-field-${index}`}
                        value={mapping.appField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "appField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. name"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`type-${index}`}>Type</Label>
                      <Select
                        value={mapping.type}
                        onValueChange={(value) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "type",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id={`type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                          <SelectItem value="relation">Relation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`default-${index}`}>Default Value</Label>
                      <Input
                        id={`default-${index}`}
                        value={mapping.defaultValue !== undefined ? String(mapping.defaultValue) : ""}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "defaultValue",
                            e.target.value,
                          )
                        }
                        placeholder="Default value"
                      />
                    </div>

                    <div className="col-span-1 flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${index}`}
                          checked={mapping.required}
                          onCheckedChange={(checked) =>
                            updateMapping(
                              fieldMappings.findIndex((m) => m === mapping),
                              "required",
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`required-${index}`}>Required</Label>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMapping(fieldMappings.findIndex((m) => m === mapping))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={() => addNewMapping(PostType.TOUR)}>Add New Field Mapping</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={PostType.CATEGORY}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Category Field Mappings</CardTitle>
              <CardDescription>
                Configure how fields from your Airtable Categories table map to the application's Category model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryMappings.map((mapping, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                    <div className="col-span-3">
                      <Label htmlFor={`airtable-field-cat-${index}`}>Airtable Field</Label>
                      <Input
                        id={`airtable-field-cat-${index}`}
                        value={mapping.airtableField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "airtableField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Name"
                      />
                    </div>

                    <div className="col-span-3">
                      <Label htmlFor={`app-field-cat-${index}`}>App Field</Label>
                      <Input
                        id={`app-field-cat-${index}`}
                        value={mapping.appField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "appField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. name"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`type-cat-${index}`}>Type</Label>
                      <Select
                        value={mapping.type}
                        onValueChange={(value) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "type",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id={`type-cat-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                          <SelectItem value="relation">Relation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`default-cat-${index}`}>Default Value</Label>
                      <Input
                        id={`default-cat-${index}`}
                        value={mapping.defaultValue !== undefined ? String(mapping.defaultValue) : ""}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "defaultValue",
                            e.target.value,
                          )
                        }
                        placeholder="Default value"
                      />
                    </div>

                    <div className="col-span-1 flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-cat-${index}`}
                          checked={mapping.required}
                          onCheckedChange={(checked) =>
                            updateMapping(
                              fieldMappings.findIndex((m) => m === mapping),
                              "required",
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`required-cat-${index}`}>Required</Label>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMapping(fieldMappings.findIndex((m) => m === mapping))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={() => addNewMapping(PostType.CATEGORY)}>Add New Field Mapping</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={PostType.DESTINATION}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Destination Field Mappings</CardTitle>
              <CardDescription>
                Configure how fields from your Airtable Destinations table map to the application's Destination model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinationMappings.map((mapping, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                    <div className="col-span-3">
                      <Label htmlFor={`airtable-field-dest-${index}`}>Airtable Field</Label>
                      <Input
                        id={`airtable-field-dest-${index}`}
                        value={mapping.airtableField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "airtableField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Name"
                      />
                    </div>

                    <div className="col-span-3">
                      <Label htmlFor={`app-field-dest-${index}`}>App Field</Label>
                      <Input
                        id={`app-field-dest-${index}`}
                        value={mapping.appField}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "appField",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. name"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`type-dest-${index}`}>Type</Label>
                      <Select
                        value={mapping.type}
                        onValueChange={(value) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "type",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id={`type-dest-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                          <SelectItem value="relation">Relation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`default-dest-${index}`}>Default Value</Label>
                      <Input
                        id={`default-dest-${index}`}
                        value={mapping.defaultValue !== undefined ? String(mapping.defaultValue) : ""}
                        onChange={(e) =>
                          updateMapping(
                            fieldMappings.findIndex((m) => m === mapping),
                            "defaultValue",
                            e.target.value,
                          )
                        }
                        placeholder="Default value"
                      />
                    </div>

                    <div className="col-span-1 flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-dest-${index}`}
                          checked={mapping.required}
                          onCheckedChange={(checked) =>
                            updateMapping(
                              fieldMappings.findIndex((m) => m === mapping),
                              "required",
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`required-dest-${index}`}>Required</Label>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMapping(fieldMappings.findIndex((m) => m === mapping))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={() => addNewMapping(PostType.DESTINATION)}>Add New Field Mapping</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => handleResetPostType(activeTab)}>
          Reset {activeTab} Mappings
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset All Mappings
        </Button>
        <Button onClick={handleSave}>Save Mappings</Button>
      </div>

      <Toaster />
    </div>
  )
}

