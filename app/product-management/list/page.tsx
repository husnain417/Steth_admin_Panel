"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft,
  Edit,
  Loader2,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ColorImage = {
  url: string;
  alt: string;
  isPrimary: boolean;
  public_id: string;
  _id: string;
}

type ColorStock = {
  color: string;
  images: ColorImage[];
  _id: string;
  // Future properties when available
  sizes?: Array<{
    size: string;
    quantity: number;
  }>;
  totalQuantity?: number;
}

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  gender: string;
  totalStock: number;
  defaultImages: Array<{
    url: string;
    alt: string;
    _id: string;
  }>;
  inventory: Array<{
    color: string;
    size: string;
    stock: number;
    _id: string;
  }>;
  colorImages: Array<{
    color: string;
    images: Array<{
      url: string;
      alt: string;
      isPrimary: boolean;
      public_id: string;
      _id: string;
    }>;
    _id: string;
  }>;
}

type ExpandedRows = Record<string, boolean>;

export default function ListProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<Record<string, { status: 'idle' | 'updating' | 'success' | 'error', loading: boolean }>>({});
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      setError('Error loading products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (product: Product) => {
    router.push(`/product-management/update?id=${product._id}`);
  };

  if (loading) {
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
            <h1 className="text-2xl font-bold">Update Products</h1>
          </div>
        </div>
        <div className="p-4 rounded-md bg-blue-100 text-blue-800">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
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
            <h1 className="text-2xl font-bold">Update Products</h1>
          </div>
        </div>
        <div className="p-4 rounded-md bg-red-100 text-red-800">
          {error}
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold">Update Products</h1>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.gender}</TableCell>
                <TableCell>Rs.{product.price.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`font-medium ${product.totalStock < 10 ? 'text-red-600' : product.totalStock < 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {product.totalStock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.inventory && product.inventory.length > 0 ? (
                      product.inventory.map((item) => (
                        <div key={item._id} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.color.toLowerCase() }}
                          ></div>
                          <span className="text-sm">
                            {item.color} - {item.size}: 
                            <span className={`ml-1 font-medium ${
                              item.stock < 5 ? 'text-red-600' : 
                              item.stock < 10 ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {item.stock}
                            </span>
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No stock data</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateClick(product)}
                    disabled={updateStatus[product._id]?.status === 'updating'}
                  >
                    {updateStatus[product._id]?.status === 'updating' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}