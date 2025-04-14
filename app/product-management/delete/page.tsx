"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  Trash2, 
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DeleteProductPage() {
  // Sample data - would be replaced with API calls
  const categories = [
    { id: 1, name: "Scrubs", value: "scrubs" },
    { id: 2, name: "Masks", value: "masks" },
    { id: 3, name: "Caps", value: "caps" }
  ]

  // Sample products by category
  const productsByCategory = {
    scrubs: [
      { id: 1, title: "Premium Scrub Set - Navy", value: "premium-scrub-navy" },
      { id: 2, title: "Basic Scrub Top - White", value: "basic-scrub-white" },
      { id: 3, title: "Comfort Scrub Pants - Black", value: "comfort-pants-black" }
    ],
    masks: [
      { id: 1, title: "N95 Medical Mask", value: "n95-mask" },
      { id: 2, title: "Surgical Face Mask - Blue", value: "surgical-mask-blue" }
    ],
    caps: [
      { id: 1, title: "Surgical Cap - Green", value: "surgical-cap-green" },
      { id: 2, title: "Bouffant Cap - White", value: "bouffant-cap-white" }
    ]
  }

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  // Get products for selected category
  const getProductsForCategory = () => {
    if (!selectedCategory) return []
    return productsByCategory[selectedCategory as keyof typeof productsByCategory] || []
  }

  // Handle delete
  const handleDelete = () => {
    if (!selectedProduct) return
    
    // This would be replaced with an actual API call
    console.log(`Deleting product: ${selectedProduct}`)
    
    // Show success message and reset form
    alert("Product deleted successfully!")
    setSelectedCategory("")
    setSelectedProduct("")
    setConfirmDelete(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/product-management">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Delete Product</h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Select Product to Delete</h2>
              <p className="text-gray-500 text-sm mb-4">
                Please select the category and product you wish to remove from the inventory.
                This action cannot be undone.
              </p>
            </div>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    setSelectedCategory(value)
                    setSelectedProduct("")
                    setConfirmDelete(false)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.value}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Selection - Only show if category is selected */}
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <Select 
                    value={selectedProduct} 
                    onValueChange={(value) => {
                      setSelectedProduct(value)
                      setConfirmDelete(false)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {getProductsForCategory().map((product) => (
                        <SelectItem key={product.id} value={product.value}>
                          {product.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Product details preview - Only show if product is selected */}
              {selectedProduct && (
                <div className="mt-6 p-4 bg-gray-900 rounded-md">
                  <h3 className="font-medium mb-2">Selected Product Details</h3>
                  <p className="text-sm text-gray-400">
                    Category: {categories.find(c => c.value === selectedCategory)?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Product: {getProductsForCategory().find(p => p.value === selectedProduct)?.title}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmation section */}
            {selectedProduct && (
              <div className="mt-6">
                {!confirmDelete ? (
                  <Button 
                    variant="destructive" 
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Continue to Delete
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}