"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  status: string
  stock: number
  isCustomersAlsoBought: boolean
}

export default function CustomersAlsoBoughtPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [customersAlsoBought, setCustomersAlsoBought] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const productsResponse = await fetch('https://steth-backend.onrender.com/api/products')
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productsData = await productsResponse.json()
        
        // Fetch customers also bought products
        const customersAlsoBoughtResponse = await fetch('https://steth-backend.onrender.com/api/products/cob')
        if (!customersAlsoBoughtResponse.ok) {
          throw new Error('Failed to fetch customers also bought products')
        }
        const customersAlsoBoughtData = await customersAlsoBoughtResponse.json()

        if (productsData.products) {
          setAllProducts(productsData.products)
        } else if (productsData.data && Array.isArray(productsData.data)) {
          setAllProducts(productsData.data)
        }

        if (customersAlsoBoughtData.products) {
          setCustomersAlsoBought(customersAlsoBoughtData.products)
        } else if (customersAlsoBoughtData.data && Array.isArray(customersAlsoBoughtData.data)) {
          setCustomersAlsoBought(customersAlsoBoughtData.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCustomersAlsoBought = async (productId: string) => {
    try {
      const response = await fetch('https://steth-backend.onrender.com/api/products/customers-also-bought/add', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add product to customers also bought')
      }

      const data = await response.json()
      if (data.success) {
        // Update the products list to reflect the change
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, isCustomersAlsoBought: true }
              : product
          )
        )
        
        // Add the product to customers also bought list
        const productToAdd = allProducts.find(p => p._id === productId)
        if (productToAdd) {
          setCustomersAlsoBought(prev => [...prev, { ...productToAdd, isCustomersAlsoBought: true }])
        }
      } else {
        throw new Error(data.message || 'Failed to add product')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleRemoveFromCustomersAlsoBought = async (productId: string) => {
    try {
      const response = await fetch('https://steth-backend.onrender.com/api/products/customers-also-bought/remove', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove product from customers also bought')
      }

      const data = await response.json()
      if (data.success) {
        // Update the products list to reflect the change
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, isCustomersAlsoBought: false }
              : product
          )
        )
        
        // Remove the product from customers also bought list
        setCustomersAlsoBought(prev => prev.filter(product => product._id !== productId))
      } else {
        throw new Error(data.message || 'Failed to remove product')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  // Filter out products that are already in customers also bought
  const availableProducts = allProducts.filter(product => !product.isCustomersAlsoBought)

  // Helper function to check if a product is in customers also bought
  const isProductInCustomersAlsoBought = (productId: string) => {
    return customersAlsoBought.some(product => product._id === productId)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers Also Bought</h1>
        <Link href="/product-management">
          <Button variant="outline">Back to Product Management</Button>
        </Link>
      </div>

      {/* Customers Also Bought Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Customers Also Bought Products</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersAlsoBought && customersAlsoBought.length > 0 ? (
                customersAlsoBought.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromCustomersAlsoBought(product._id)}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No products in Customers Also Bought
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* All Products Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableProducts && availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCustomersAlsoBought(product._id)}
                        disabled={isProductInCustomersAlsoBought(product._id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isProductInCustomersAlsoBought(product._id) ? 'Already Added' : 'Add to Customers Also Bought'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No available products
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
} 