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
  Trash2, 
  AlertTriangle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
}

export default function DeleteProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<Record<string, { status: 'idle' | 'deleting' | 'success' | 'error', loading: boolean }>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setDeleteStatus(prev => ({ ...prev, [productToDelete._id]: { status: 'deleting', loading: true } }));
    setDeleteDialogOpen(false);
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteStatus(prev => ({ ...prev, [productToDelete._id]: { status: 'success', loading: false } }));
        // Remove the deleted product from the list
        setProducts(prev => prev.filter(product => product._id !== productToDelete._id));
        // Clear the status after 2 seconds
        setTimeout(() => {
          setDeleteStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[productToDelete._id];
            return newStatus;
          });
        }, 2000);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      setDeleteStatus(prev => ({ ...prev, [productToDelete._id]: { status: 'error', loading: false } }));
      console.error('Error deleting product:', error);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
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
            <h1 className="text-2xl font-bold">Delete Products</h1>
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
            <h1 className="text-2xl font-bold">Delete Products</h1>
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
          <h1 className="text-2xl font-bold">Delete Products</h1>
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
                <TableCell>Rs.{product.price}</TableCell>
                <TableCell>{product.totalStock}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                    disabled={deleteStatus[product._id]?.status === 'deleting'}
                  >
                    {deleteStatus[product._id]?.status === 'deleting' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
                        Cancel
                      </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
                        <Trash2 className="h-4 w-4 mr-2" />
              Delete
                      </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}