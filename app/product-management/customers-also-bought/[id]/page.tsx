"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  relatedProducts: string[];
}

export default function EditRelatedProductsPage() {
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current product
        const productResponse = await fetch(`http://localhost:5000/api/products/${params.id}`)
        const productData = await productResponse.json()
        if (productData.product) {
          setProduct(productData.product)
        }

        // Fetch all products
        const productsResponse = await fetch('http://localhost:5000/api/products')
        const productsData = await productsResponse.json()
        if (productsData.products) {
          setAllProducts(productsData.products.filter((p: Product) => p._id !== params.id))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch product data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const toggleRelatedProduct = (productId: string) => {
    if (!product) return

    const isRelated = product.relatedProducts.includes(productId)
    const newRelatedProducts = isRelated
      ? product.relatedProducts.filter(id => id !== productId)
      : [...product.relatedProducts, productId]

    setProduct({
      ...product,
      relatedProducts: newRelatedProducts
    })
  }

  const handleSave = async () => {
    if (!product) return

    setSaving(true)
    try {
      const response = await fetch(`http://localhost:5000/api/products/${params.id}/related`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          relatedProducts: product.relatedProducts
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Related products updated successfully"
        })
      } else {
        throw new Error(data.message || "Failed to update related products")
      }
    } catch (error) {
      console.error("Error saving related products:", error)
      toast({
        title: "Error",
        description: "Failed to update related products",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/product-management/customers-also-bought">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/product-management/customers-also-bought">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/product-management/customers-also-bought">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Related Products</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Current Product</h2>
          <p className="text-gray-500">{product.name}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Related</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((relatedProduct) => (
              <TableRow key={relatedProduct._id}>
                <TableCell className="font-medium">{relatedProduct.name}</TableCell>
                <TableCell>{relatedProduct.category}</TableCell>
                <TableCell>PKR {relatedProduct.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleRelatedProduct(relatedProduct._id)}
                  >
                    {product.relatedProducts.includes(relatedProduct._id) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
} 