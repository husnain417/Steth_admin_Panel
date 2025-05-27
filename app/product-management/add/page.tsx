"use client"

import { useState, useEffect } from "react"
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  X, 
  Plus, 
  Save,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Define types for our form data and related objects
type Color = {
  id: number;
  name: string;
  value: string;
  code: string;
}

type Size = {
  id: number;
  name: string;
  value: string;
}

type Category = {
  id: number;
  name: string;
  value: string;
}

type Material = {
  id: number;
  name: string;
  value: string;
}

type Gender = {
  id: number;
  name: string;
  value: string;
}

type InventoryItem = {
  color: string;
  size: string;
  stock: number;
}

type FormData = {
  title: string;
  description: string;
  category: string;
  customCategory: string;
  gender: string;
  material: string;
  customMaterial: string;
  price: string;
  colors: string[];
  selectedSizes: string[];
  colorSizeInventory: InventoryItem[];
}

export default function AddProductPage() {
  // Available options for dropdowns
  const availableColors: Color[] = [
    { id: 1, name: "Black", value: "Black", code: "#000000" },
    { id: 2, name: "Emerald", value: "Emerald", code: "#50C878" },
    { id: 3, name: "Navy Blue", value: "Navy Blue", code: "#000080" },
    { id: 4, name: "Maroon", value: "Maroon", code: "#800000" },
    { id: 5, name: "Ceil Blue", value: "Ceil Blue", code: "#92A1CF" }
  ]

  const availableSizes: Size[] = [
    { id: 1, name: "XS", value: "XS" },
    { id: 2, name: "S", value: "S" },
    { id: 3, name: "M", value: "M" },
    { id: 4, name: "L", value: "L" },
    { id: 5, name: "XL", value: "XL" },
    { id: 6, name: "XXL", value: "XXL" }
  ]

  const categories: Category[] = [
    { id: 1, name: "Scrubs", value: "Scrubs" },
    { id: 2, name: "Masks", value: "Masks" },
    { id: 3, name: "Caps", value: "Caps" }
  ]

  const materials: Material[] = [
    { id: 1, name: "Cotton", value: "Cotton" },
    { id: 2, name: "Polyester", value: "Polyester" },
    { id: 3, name: "Cotton Blend", value: "Cotton Blend" },
    { id: 4, name: "Spandex", value: "Spandex" }
  ]

  const genders: Gender[] = [
    { id: 1, name: "Men", value: "Men" },
    { id: 2, name: "Women", value: "Women" },
  ]
  
  

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    gender: "",
    material: "",
    customMaterial: "",
    price: "",
    colors: [],
    selectedSizes: [],
    colorSizeInventory: []
  });

  // State for color and size selection
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [sizeQuantity, setSizeQuantity] = useState<string>("")
  const [customColor, setCustomColor] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedInventoryColor, setSelectedInventoryColor] = useState<string>("")
  const [responseMessage, setResponseMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      customCategory: "",
      gender: "",
      material: "",
      customMaterial: "",
      price: "",
      colors: [],
      selectedSizes: [],
      colorSizeInventory: []
    });
    setSelectedColor("");
    setSelectedSize("");
    setSizeQuantity("");
    setCustomColor("");
    setColorCode("");
    setSelectedInventoryColor("");
  };

  // Check if form is valid
  useEffect(() => {
    const isValidDetails = Boolean(
      formData.title && 
      formData.description && 
      formData.price && 
      (formData.category && formData.category !== "custom" || (formData.category === "custom" && formData.customCategory)) &&
      (formData.material && formData.material !== "custom" || (formData.material === "custom" && formData.customMaterial))
    );
    
    const isValidVariants = Boolean(
      formData.colors.length > 0 && 
      formData.selectedSizes.length > 0 &&
      formData.colorSizeInventory.length > 0
    );
    
    setIsFormValid(isValidDetails && isValidVariants);
  }, [formData]);

  // Handle color selection
  const addColor = () => {
    if (selectedColor && !formData.colors.includes(selectedColor)) {
      const colorObj = availableColors.find(c => c.value === selectedColor);
      if (colorObj) {
        setFormData({
          ...formData,
          colors: [...formData.colors, selectedColor]
        });
      }
      setSelectedColor("");
    }
  }

  const addCustomColor = (color: string) => {
    if (color && !formData.colors.includes(color) && colorCode) {
      // Validate hex code format
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexRegex.test(colorCode)) {
        setResponseMessage({ 
          text: "Please enter a valid hex color code (e.g., #000000)", 
          type: 'error' 
        });
        return;
      }
      
      // Create a unique value for the custom color (using the name in lowercase with hyphens)
      const customColorValue = color.toLowerCase().replace(/\s+/g, '-');
      
      // Add the custom color to the available colors array so it can be properly referenced
      const newColor = {
        id: Date.now(), // Use timestamp for a unique ID
        name: color,
        value: customColorValue,
        code: colorCode
      };
      
      // Update the availableColors array
      availableColors.push(newColor);
      
      // Update form data with the new color
      setFormData({
        ...formData,
        colors: [...formData.colors, customColorValue] // Store the value, not the name
      });
      
      setCustomColor("");
      setColorCode("");
      setSelectedColor("");
    }
  };

  // Remove a color
  const removeColor = (color: string) => {
    const newColors = formData.colors.filter(c => c !== color);
    // Also remove inventory entries for this color
    const newInventory = formData.colorSizeInventory.filter(item => item.color !== color);
    
    setFormData({
      ...formData,
      colors: newColors,
      colorSizeInventory: newInventory
    });
  }

  const addSizeInventory = () => {
    if (selectedInventoryColor && selectedSize && sizeQuantity) {
      const quantityNum = parseInt(sizeQuantity);
      if (isNaN(quantityNum) || quantityNum < 1) {
        alert("Please enter a valid quantity");
        return;
      }
      
      // Check if this color-size combination already exists
      const existingEntry = formData.colorSizeInventory.find(
        item => item.color === selectedInventoryColor && item.size === selectedSize
      );
      
      if (existingEntry) {
        alert("This color and size combination already exists");
        return;
      }
      
      // Add to inventory
      setFormData({
        ...formData,
        selectedSizes: [...new Set([...formData.selectedSizes, selectedSize])],
        colorSizeInventory: [
          ...formData.colorSizeInventory,
          {
            color: selectedInventoryColor,
            size: selectedSize,
            stock: quantityNum
          }
        ]
      });
      
      setSelectedSize("");
      setSizeQuantity("");
    } else {
      alert("Please select color, size, and quantity");
    }
  }
  // Remove an inventory entry
  const removeInventoryItem = (colorVal: string, sizeVal: string) => {
    const newInventory = formData.colorSizeInventory.filter(
      item => !(item.color === colorVal && item.size === sizeVal)
    );
    
    // Check if we need to remove any sizes that are no longer used
    const sizesStillInUse = new Set(newInventory.map(item => item.size));
    const newSizes = formData.selectedSizes.filter(size => sizesStillInUse.has(size));
    
    setFormData({
      ...formData,
      colorSizeInventory: newInventory,
      selectedSizes: newSizes
    });
  }

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: keyof FormData, value: string) => {
    if (name === 'gender') {
      setFormData(prev => ({
        ...prev,
      [name]: value
    }));
    } else if (value === "custom") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        [`custom${name.charAt(0).toUpperCase() + name.slice(1)}`]: ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        [`custom${name.charAt(0).toUpperCase() + name.slice(1)}`]: ""
      }));
    }
  };

  const formatDataForApi = () => {
    // Clean up input data
    const cleanPrice = parseFloat(formData.price);
    
    // Create a color mapping for easy lookup
    const colorMapping: { [key: string]: { name: string; code: string } } = {};
    formData.colors.forEach(colorValue => {
      const colorObj = availableColors.find(c => c.value === colorValue);
      if (colorObj) {
        colorMapping[colorValue] = {
          name: colorObj.name,
          code: colorObj.code
        };
    } else {
        // For custom colors, use the color value as name and code
        colorMapping[colorValue] = {
          name: colorValue,
          code: colorValue
        };
      }
    });
    
    // Format the data for API
    const formattedData = {
      name: formData.title.trim(),
      description: formData.description.trim(),
      price: cleanPrice,
      category: formData.category === "custom" ? formData.customCategory.trim() : formData.category,
      gender: formData.gender,
      material: formData.material === "custom" ? formData.customMaterial.trim() : formData.material,
      colors: formData.colors.map(colorValue => ({
        name: colorMapping[colorValue].name,
        value: colorValue,
        code: colorMapping[colorValue].code,
        available: true
      })),
      sizes: formData.selectedSizes.map(size => {
        const sizeObj = availableSizes.find(s => s.value === size);
      return {
          name: sizeObj ? sizeObj.name : size.toUpperCase(),
          value: size.toUpperCase(),
          available: true
        };
      }),
      inventory: formData.colorSizeInventory.map(item => ({
        color: item.color,
        size: item.size.toUpperCase(),
        stock: Number(item.stock)
      }))
    };
  
    // Debug log
    console.log("Colors sent to API:", formattedData.colors);
    console.log("Inventory sent to API:", formattedData.inventory);
    
    return formattedData;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setResponseMessage({ text: "Please fill in all required fields", type: 'error' });
      return;
    }
  
    // Check if all colors have size and quantity entries
    const colorsWithoutInventory = formData.colors.filter(color => {
      return !formData.colorSizeInventory.some(item => item.color === color);
    });
  
    if (colorsWithoutInventory.length > 0) {
      const colorNames = colorsWithoutInventory.map(color => {
        const colorObj = availableColors.find(c => c.value === color);
        return colorObj ? colorObj.name : color;
      });
      
      setResponseMessage({ 
        text: `No size and quantity added for the following colors: ${colorNames.join(', ')}`, 
        type: 'error' 
      });
      return;
    }
    
    const dataForApi = formatDataForApi();
    console.log("Sending data to API:", dataForApi);
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForApi)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Product created with ID:', data.data._id);
        if (!data.data._id) {
          setResponseMessage({ text: "Error: Product ID not received from server", type: 'error' });
          return;
        }
        setResponseMessage({ text: "Product added successfully! Redirecting to image upload...", type: 'success' });
        // Redirect to image upload page with product data
        router.push(`/product-management/${data.data._id}/images?productData=${encodeURIComponent(JSON.stringify(data.data))}`);
      } else {
        const errorText = await response.text(); // Get the raw response text
        let errorMessage = "Failed to add product";
        
        try {
          // Try to parse it as JSON
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        console.error("Server error response:", errorText); // Debug log
        setResponseMessage({ text: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setResponseMessage({ text: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const debugColorData = () => {
    console.log("Available colors:", availableColors);
    console.log("Form data colors:", formData.colors);
    console.log("Color-size inventory:", formData.colorSizeInventory);
    
    // Check for mismatches
    formData.colorSizeInventory.forEach(item => {
      const colorExists = formData.colors.includes(item.color);
      if (!colorExists) {
        console.error(`MISMATCH: Inventory uses color "${item.color}" which is not in colors array`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col items-center gap-6 min-w-[300px]">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">Creating Product</p>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we process your request...
              </p>
            </div>
          </div>
        </div>
      )}
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
      </div>

      {responseMessage && (
        <div className={`p-4 rounded-md ${responseMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {responseMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="variants">Colors & Sizes</TabsTrigger>
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
                    <div className="flex gap-2">
                      <Select 
                        value={formData.category} 
                        onValueChange={(value: string) => {
                          handleSelectChange("category", value);
                          if (value !== "custom") {
                            setFormData(prev => ({
                              ...prev,
                              customCategory: ""
                            }));
                          }
                        }}
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
                          <SelectItem value="custom">Custom category</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.category === "custom" && (
                        <Input 
                          placeholder="Enter category" 
                          value={formData.customCategory}
                          name="customCategory"
                          onChange={handleChange}
                          required
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender*</Label>
                      <Select 
                        value={formData.gender}
                      onValueChange={(value: string) => handleSelectChange("gender", value)}
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
                    <div className="flex gap-2">
                      <Select 
                        value={formData.material}
                        onValueChange={(value: string) => {
                          handleSelectChange("material", value);
                          if (value !== "custom") {
                            setFormData(prev => ({
                              ...prev,
                              customMaterial: ""
                            }));
                          }
                        }}
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
                          <SelectItem value="custom">Custom material</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.material === "custom" && (
                        <Input 
                          placeholder="Enter material" 
                          value={formData.customMaterial}
                          name="customMaterial"
                          onChange={handleChange}
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>
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
                    <Label htmlFor="color">Add Color*</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedColor}
                        onValueChange={(value: string) => {
                          setSelectedColor(value);
                          if (value !== "custom") {
                            setCustomColor("");
                            setColorCode("");
                          }
                        }}
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
                        <>
                          <Input 
                            placeholder="Enter color name" 
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                          />
                          <Input 
                            placeholder="Enter hex code (e.g., #000000)" 
                            value={colorCode}
                            onChange={(e) => setColorCode(e.target.value)}
                            pattern="^#[0-9A-Fa-f]{6}$"
                            title="Please enter a valid hex color code (e.g., #000000)"
                          />
                        </>
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
                      const colorObj = availableColors.find(c => c.value === color) || { name: color, value: color, id: 0, code: "" };
                      
                      return (
                        <div 
                          key={color} 
                          className="flex items-center rounded-full px-3 py-1 bg-gray-800"
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
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 my-6"></div>

              <h3 className="text-lg font-medium mb-4">Size & Inventory</h3>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                <div className="flex-1">
                    <Label htmlFor="color-select">Color*</Label>
                    <Select 
                      value={selectedInventoryColor}
                      onValueChange={(value: string) => setSelectedInventoryColor(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.colors.map(color => {
                          const colorObj = availableColors.find(c => c.value === color) || { name: color, value: color, id: 0, code: "" };
                          return (
                            <SelectItem key={color} value={color}>
                              {colorObj.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="size">Size*</Label>
                    <Select 
                      value={selectedSize}
                      onValueChange={(value: string) => setSelectedSize(value)}
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
                    <Label htmlFor="quantity">Quantity*</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="0" 
                      value={sizeQuantity}
                      onChange={(e) => setSizeQuantity(e.target.value)}
                      min="1"
                    />
                  </div>
                  <Button type="button" onClick={addSizeInventory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {formData.colorSizeInventory.length > 0 && (
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Color</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.colorSizeInventory.map((item, index) => {
                        const colorObj = availableColors.find(c => c.value === item.color) || { name: item.color, value: item.color, id: 0, code: "" };
                        const sizeObj = availableSizes.find(s => s.value === item.size) || { name: item.size, value: item.size, id: 0 };
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{colorObj.name}</TableCell>
                            <TableCell>{sizeObj.name}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => removeInventoryItem(item.color, item.size)}
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
        </Tabs>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Product
          </Button>
        </div>
      </form>
    </div>
  )
}