"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, RefreshCw, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function ProductManagementPage() {
  const [productStats, setProductStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
    totalUnitCount: 0, // added this to store the total unit count
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await fetch('https://steth-backend.onrender.com/api/dashboard/product-stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add your Authorization header here if needed
            // 'Authorization': `Bearer ${yourToken}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch product stats')
        }

        const data = await response.json()
        
        if (data.success) {
          setProductStats({
            total: data.stats.total,
            active: data.stats.active,
            outOfStock: data.stats.outOfStock,
            lowStock: data.stats.lowStock,
            totalUnitCount: data.stats.inventory.totalUnitCount // capture totalUnitCount from the response
          })
        } else {
          console.error('Failed to load product stats')
        }
      } catch (err) {
        console.error('Error fetching product stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductStats()
  }, [])

  return (
    <>
      {/* Product management card */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Product Management</h2>
        <p className="mb-4">Manage your products and inventory here.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-medium">Total Products</h3>
              <p className="text-2xl font-bold">{isLoading ? 'Loading...' : productStats.total}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium">Active Products</h3>
              <p className="text-2xl font-bold">{isLoading ? 'Loading...' : productStats.active}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium">Out of Stock</h3>
              <p className="text-2xl font-bold">{isLoading ? 'Loading...' : productStats.outOfStock}</p>
            </Card>
            {/* New card for Total Unit Count */}
            <Card className="p-4">
              <h3 className="font-medium">Total Unit Count</h3>
              <p className="text-2xl font-bold">{isLoading ? 'Loading...' : productStats.totalUnitCount}</p>
            </Card>
          </div>
        </div>
      </Card>

      {/* Product management buttons in a responsive row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-2 mt-8">
        <Link
          href="/product-management/add"
          className="flex items-center justify-center h-12 px-6 text-lg rounded-md bg-white text-black shadow-sm transition-colors hover:bg-gray-100 hover:text-black"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Product
        </Link>

        <Link
          href="/product-management/delete"
          className="flex items-center justify-center h-12 px-6 text-lg rounded-md bg-destructive text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Product
        </Link>

        <Link
          href="/product-management/update"
          className="flex items-center justify-center h-12 px-6 text-lg rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Update Product
        </Link>

        <Link
          href="/product-management/customers-also-bought"
          className="flex items-center justify-center h-12 px-6 text-lg rounded-md bg-green-600 text-white shadow-sm transition-colors hover:bg-green-700"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Customers Also Bought
        </Link>
      </div>
    </>
  )
}
