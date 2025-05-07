"use client"

import { useState, useEffect, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChangeEvent, FormEvent } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  X, 
  Plus, 
  Save
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// This is a wrapper component that uses useSearchParams
function ProductUpdateContent() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      router.push(`/product-management/update/${productId}`);
    } else {
      router.push('/product-management/list');
    }
  }, [productId, router]);

  // Available options for dropdowns
  const availableColors = [
    { id: 1, name: "Black", value: "black" },
    { id: 2, name: "White", value: "white" },
    { id: 3, name: "Navy Blue", value: "navy" },
    { id: 4, name: "Light Blue", value: "light-blue" },
    { id: 5, name: "Green", value: "green" },
    { id: 6, name: "Pink", value: "pink" }
  ]

  const availableSizes = [
    { id: 1, name: "XS", value: "xs" },
    { id: 2, name: "S", value: "s" },
    { id: 3, name: "M", value: "m" },
    { id: 4, name: "L", value: "l" },
    { id: 5, name: "XL", value: "xl" },
    { id: 6, name: "XXL", value: "xxl" }
  ]

  // State for the form data
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    colors: string[];
    selectedSizes: string[];
    inventory: Record<string, number>;
  }>({
    title: "Example Product",
    description: "This is an example product description.",
    price: "1500",
    colors: ["black", "navy"],
    selectedSizes: ["s", "m", "l"],
    inventory: { "s": 10, "m": 15, "l": 8 }
  })

  // State for color and size selection
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [sizeQuantity, setSizeQuantity] = useState("")
  const [customColor, setCustomColor] = useState("");

  // Handle color selection
  const addColor = () => {
    if (selectedColor && !formData.colors.includes(selectedColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, selectedColor]
      })
      setSelectedColor("")
    }
  }

  const addCustomColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
      setCustomColor("");
      setSelectedColor("");
    }
  };

  // Remove a color
  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c: string) => c !== color)
    })
  }

  // Handle size inventory
  const addSizeInventory = () => {
    if (selectedSize && sizeQuantity && !formData.selectedSizes.includes(selectedSize)) {
      setFormData({
        ...formData,
        selectedSizes: [...formData.selectedSizes, selectedSize],
        inventory: {
          ...formData.inventory,
          [selectedSize]: parseInt(sizeQuantity)
        }
      })
      setSelectedSize("")
      setSizeQuantity("")
    }
  }

  // Remove a size
  const removeSize = (size: string) => {
    const newSizes = formData.selectedSizes.filter((s: string) => s !== size)
    const newInventory: Record<string, number> = { ...formData.inventory }
    delete newInventory[size]
    
    setFormData({
      ...formData,
      selectedSizes: newSizes,
      inventory: newInventory
    })
  }

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call to update product here
    alert("Product updated successfully!");
  };

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
          <h1 className="text-2xl font-bold">Update Product</h1>
        </div>
        <Button type="submit" form="update-product-form" className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Update Product
        </Button>
      </div>

      <form id="update-product-form" onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Product Details */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title*</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="Enter product title" 
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR)*</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description*</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter product description" 
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Colors Section */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Available Colors</h3>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="color">Add Color</Label>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={(value) => {
                        setSelectedColor(value);
                        if (value !== "custom") {
                          setCustomColor("");
                        }
                      }}
                      value={selectedColor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map(color => (
                          <SelectItem key={color.id} value={color.value}>
                            {color.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom color</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedColor === "custom" && (
                      <Input 
                        placeholder="Enter color name" 
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-1/2"
                      />
                    )}
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={() => {
                    if (selectedColor === "custom" && customColor.trim()) {
                      addCustomColor(customColor.trim());
                    } else if (selectedColor && selectedColor !== "custom") {
                      addColor();
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {formData.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.colors.map(color => {
                    const colorObj = availableColors.find(c => c.value === color) || { name: color, value: color };
                    return (
                      <div 
                        key={color} 
                        className="flex items-center bg-gray-800 rounded-full px-3 py-1"
                      >
                        <span className="mr-2">{colorObj.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0 rounded-full"
                          onClick={() => removeColor(color)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Sizes Section */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Size & Inventory</h3>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="size">Size</Label>
                  <Select 
                    onValueChange={setSelectedSize}
                    value={selectedSize}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map(size => (
                        <SelectItem key={size.id} value={size.value}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="0" 
                    value={sizeQuantity}
                    onChange={(e) => setSizeQuantity(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={addSizeInventory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {formData.selectedSizes.length > 0 && (
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.selectedSizes.map(size => {
                      const sizeObj = availableSizes.find(s => s.value === size)
                      return (
                        <TableRow key={size}>
                          <TableCell className="font-medium">{sizeObj?.name}</TableCell>
                          <TableCell>{formData.inventory[size]}</TableCell>
                          <TableCell>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => removeSize(size)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </div>
  )
}

// Main page component with proper Suspense boundary
export default function UpdateProductPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading product information...</div>}>
      <ProductUpdateContent />
    </Suspense>
  );
}