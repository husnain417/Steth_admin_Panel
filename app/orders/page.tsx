"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Eye, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type OrderItem = {
  product: any
  productName: string
  color: string
  size: string
  quantity: number
  price: number
  _id: string
}

type ShippingAddress = {
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
}

type PaymentReceipt = {
  url: string
  public_id: string
  uploaded: boolean
}

type Order = {
  _id: string
  user: {
    _id: string
    email: string
  }
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  discount: number
  discountCode: string
  pointsUsed: number
  pointsEarned: number
  total: number
  paymentMethod: "cash-on-delivery" | "bank-transfer"
  paymentReceipt?: PaymentReceipt
  status: string
  isFirstOrder: boolean
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://steth-backend.onrender.com/api/orders/all")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      setError("Error connecting to server")
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodDisplay = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "cash-on-delivery":
        return (
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-1 text-green-600" />
            <span>Cash on Delivery</span>
          </div>
        )
      case "bank-transfer":
        return (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-blue-600" />
            <span>Bank Transfer</span>
          </div>
        )
      default:
        return paymentMethod
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                <TableCell>
                  <div>
                    <div>{order.shippingAddress.fullName}</div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {order.items.map((item, index) => (
                    <div key={item._id} className="text-sm">
                      {item.quantity}x {item.productName || ""} - {item.color} ({item.size})
                      {index < order.items.length - 1 && ", "}
                    </div>
                  ))}
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {getPaymentMethodDisplay(order.paymentMethod)}
                  {order.paymentMethod === "bank-transfer" && order.paymentReceipt?.uploaded && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="mt-1 h-8">
                          <Eye className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Payment Receipt</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          {order.paymentReceipt?.url ? (
                            <div className="relative h-[70vh] w-full">
                              <Image
                                src={order.paymentReceipt.url || "/placeholder.svg"}
                                alt="Payment Receipt"
                                fill
                                className="object-contain rounded-md cursor-zoom-in"
                              />
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-100 text-center rounded-md">Receipt image not available</div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/orders/${order._id}/update-status`}>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
