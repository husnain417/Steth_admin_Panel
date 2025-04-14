"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChangeEvent, FormEvent, MouseEvent } from 'react';
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  X, 
  Plus, 
  Upload, 
  Save, 
  Tag 
} from "lucide-react"
import Link from "next/link"

export default function AddProductPage() {
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

  const categories = [
    { id: 1, name: "Scrubs", value: "scrubs" },
    { id: 2, name: "Masks", value: "masks" },
    { id: 3, name: "Caps", value: "caps" }
  ]

  const materials = [
    { id: 1, name: "Cotton", value: "cotton" },
    { id: 2, name: "Polyester", value: "polyester" },
    { id: 3, name: "Cotton Blend", value: "cotton-blend" },
    { id: 4, name: "Spandex", value: "spandex" }
  ]

  const genders = [
    { id: 1, name: "Men", value: "men" },
    { id: 2, name: "Women", value: "women" },
    { id: 3, name: "Unisex", value: "unisex" }
  ]

// Update your useState call to include images array
const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    gender: string;
    material: string;
    price: string;
    discountPrice: string;
    colors: string[];
    selectedSizes: string[];
    inventory: Record<string, number>;
    images: Array<{url: string, file: File, name: string}>;  // Add this line
  }>({
    title: "",
    description: "",
    category: "",
    gender: "",
    material: "",
    price: "",
    discountPrice: "",
    colors: [],
    selectedSizes: [],
    inventory: {},
    images: []  // Add this line
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
    // Handle image upload
const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || formData.images.length >= 5) return;
    
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name
    }));
    
    // Calculate how many more images we can add before hitting the limit
    const remainingSlots = 5 - formData.images.length;
    const imagesToAdd = newImages.slice(0, remainingSlots);
    
    setFormData({
      ...formData,
      images: [...formData.images, ...imagesToAdd]
    });
    
    // Reset the input
    e.target.value = '';
  };
  
  // Remove image function
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

// Handle input changes
const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData({
        ...formData,
        [name]: value
    })
}

// Handle form submission
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call to save product here
    alert("Product added successfully!");
  };
  
  // Button click handler
  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("Form submitted:", formData);
    // Add API call to save product here
    alert("Product added successfully!");
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
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>
        <Button onClick={handleButtonClick} className="flex items-center">
        <Save className="h-4 w-4 mr-2" />
          Save Product
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="variants">Colors & Sizes</TabsTrigger>
            <TabsTrigger value="images">Images & Media</TabsTrigger>
          </TabsList>

          {/* Product Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-6">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("category", value)}
                      value={formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.value}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender*</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      value={formData.gender}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(gender => (
                          <SelectItem key={gender.id} value={gender.value}>
                            {gender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material*</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("material", value)}
                      value={formData.material}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map(material => (
                          <SelectItem key={material.id} value={material.value}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
                    <Input 
                      id="discountPrice" 
                      name="discountPrice" 
                      type="number"
                      placeholder="0.00" 
                      value={formData.discountPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU / Product Code</Label>
                    <div className="flex">
                      <Input 
                        placeholder="Auto-generated" 
                        disabled 
                        className="bg-gray-800"
                      />
                      <Button variant="ghost" type="button" className="ml-2">
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div> */}
              </div>
            </Card>
          </TabsContent>

          {/* Colors & Sizes Tab */}
          <TabsContent value="variants" className="space-y-6">
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
                            // If a preset color is selected, clear any custom color
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
                        // Add custom color
                        addCustomColor(customColor.trim());
                        } else if (selectedColor && selectedColor !== "custom") {
                        // Add preset color
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

              <div className="border-t border-gray-800 my-6"></div>

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
          </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Product Images</h3>
                
                {/* Image upload zone with drag and drop */}
                <div 
                className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 mb-6"
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add("border-blue-500");
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("border-blue-500");
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("border-blue-500");
                    
                    if (formData.images.length >= 5) return;
                    
                    const files = e.dataTransfer.files;
                    if (files.length === 0) return;
                    
                    // Filter for only image files
                    const imageFiles = Array.from(files).filter(file => 
                    file.type.startsWith('image/')
                    );
                    
                    if (imageFiles.length === 0) return;
                    
                    // Process the dropped image files
                    const newImages = imageFiles.map(file => ({
                    url: URL.createObjectURL(file),
                    file: file,
                    name: file.name
                    }));
                    
                    // Calculate how many more images we can add before hitting the limit
                    const remainingSlots = 5 - formData.images.length;
                    const imagesToAdd = newImages.slice(0, remainingSlots);
                    
                    setFormData({
                    ...formData,
                    images: [...formData.images, ...imagesToAdd]
                    });
                }}
                >
                <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    multiple
                    disabled={formData.images.length >= 5}
                />
                <Upload className="h-8 w-8 mb-2 text-gray-500" />
                <p className="text-sm font-medium mb-1">Drop your image here</p>
                <p className="text-xs text-gray-500 mb-3">PNG, JPG up to 5MB (max 5 images)</p>
                <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={formData.images.length >= 5}
                >
                    Select Files
                </Button>
                {formData.images.length >= 5 && (
                    <p className="text-xs text-amber-500 mt-2">Maximum 5 images allowed</p>
                )}
                </div>
                
                {/* Display uploaded images */}
                {formData.images.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3">Uploaded Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                        <img 
                            src={image.url} 
                            alt={`Product image ${index + 1}`} 
                            className="w-full h-40 object-cover rounded-md"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeImage(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </Card>
            </TabsContent>
            </Tabs>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  )
}