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

type OrderItem = {
  product: {
    _id: string;
    name: string;
  };
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  _id: string;
}

type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

type PaymentReceipt = {
  url: string;
  public_id: string;
  uploaded: boolean;
}

type Order = {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  discountCode: string;
  shippingCharges: number;
  total: number;
  pointsUsed: number;
  pointsEarned: number;
  paymentMethod: "cash-on-delivery" | "bank-transfer";
  paymentReceipt?: PaymentReceipt;
  paymentStatus: string;
  orderStatus: string;
  isFirstOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

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
          setSelectedStatus(foundOrder.orderStatus);
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
      console.log('Making PUT request to:', `http://localhost:5000/api/orders/update-status/${id}`);
      const response = await fetch(`http://localhost:5000/api/orders/update-status/${id}`, {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Order ID:</span>
              <p className="text-sm">{order._id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Order Date:</span>
              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Last Updated:</span>
              <p className="text-sm">{new Date(order.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">First Order:</span>
              <p className="text-sm">{order.isFirstOrder ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </Card>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-sm">{order.shippingAddress.fullName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-sm">{order.user.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone:</span>
              <p className="text-sm">{order.shippingAddress.phoneNumber}</p>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="space-y-2">
            <p className="text-sm">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-sm">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-sm">{order.shippingAddress.country}</p>
          </div>
        </Card>

        {/* Payment Information */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Payment Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Method:</span>
              <p className="text-sm capitalize">{order.paymentMethod.replace('-', ' ')}</p>
            </div>

            {order.paymentReceipt && (
              <div>
                <span className="text-sm font-medium text-gray-500">Payment Receipt:</span>
                <p className="text-sm text-blue-600">
                  <a href={order.paymentReceipt.url} target="_blank" rel="noopener noreferrer">
                    View Receipt
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={item._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      Color: {item.color} | Size: {item.size} | Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">Product ID: {item.product._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Total: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount ({order.discountCode}):</span>
              <span>-Rs. {order.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charges:</span>
              <span>Rs. {order.shippingCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Points Used:</span>
              <span>{order.pointsUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Points Earned:</span>
              <span>{order.pointsEarned}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Status Update */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Update Order Status</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <p className="text-sm text-gray-500 capitalize">{order.orderStatus}</p>
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
                disabled={updating || selectedStatus === order.orderStatus}
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
    </div>
  );
} 