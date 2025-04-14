"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"


export default function ProductManagementPage() {
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
            <p className="text-2xl font-bold">128</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium">Active Products</h3>
            <p className="text-2xl font-bold">96</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium">Out of Stock</h3>
            <p className="text-2xl font-bold">12</p>
          </Card>
        </div>
      </div>
    </Card>
           {/* Product management buttons in a responsive row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 mt-8">
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
          </div>
        </>
  )
}