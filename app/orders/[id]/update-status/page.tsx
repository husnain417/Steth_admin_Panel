"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

type Order = {
  _id: string;
  status: string;
  user: {
    email: string;
  };
  shippingAddress: {
    fullName: string;
  };
}

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function UpdateOrderStatusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`https://steth-backend.onrender.com/api/orders/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      if (data.success) {
        const foundOrder = data.orders.find((order: Order) => order._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
          setSelectedStatus(foundOrder.status);
        } else {
          setError('Order not found');
        }
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    
    console.log('Starting status update...');
    console.log('Order ID:', id);
    console.log('New Status:', selectedStatus);
    
    setUpdating(true);
    try {
      console.log('Making PUT request to:', `https://steth-backend.onrender.com/api/orders/update-status/${id}`);
      const response = await fetch(`https://steth-backend.onrender.com/api/orders/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Status update successful');
        router.push('/orders');
      } else {
        console.error('Update failed:', data.message || 'Unknown error');
        setError(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error in handleStatusUpdate:', error);
      setError(`Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          Order not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/orders">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Update Order Status</h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Order Details</h2>
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
            <p className="text-sm text-gray-500">Customer: {order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-500">Email: {order.user.email}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Status</label>
            <p className="text-sm text-gray-500">{order.status}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === order.status}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 