"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingBag, Users, TrendingUp, CreditCard, Award, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface Product {
  _id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  image: string | null;
}

interface StudentVerification {
  _id: string;
  name: string;
  profilePicUrl: string;
  studentId: string;
  institutionName: string;
  proofDocument: string;
  status: string;
  verificationDate: string;
}

interface DashboardData {
  totalOrders: number;
  revenue: {
    totalRevenue: number;
    averageOrderValue: number;
  };
  studentUserCount: number;
  totalPointsEarned: number;
  totalPointsUsed: number;
  studentDiscounts: {
    totalAmount: number;
    count: number;
  };
  firstOrderDiscounts: {
    totalAmount: number;
    count: number;
  };
}

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState("thisMonth")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([])
  const [studentVerifications, setStudentVerifications] = useState<StudentVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/dashboard/stats')
        const data = await response.json()

        if (data.success) {
          setDashboardData(data.stats)
        } else {
          console.error('Failed to fetch dashboard data')
          setError('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }

    const fetchBestSellingProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/bestselling')
        const data = await response.json()

        if (data.success) {
          setBestSellingProducts(data.products)
        } else {
          console.error('Failed to fetch bestselling products')
        }
      } catch (error) {
        console.error('Error fetching bestselling products:', error)
      }
    }

    const fetchStudentVerifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/student-verifications')
        const data = await response.json()

        if (data.success) {
          setStudentVerifications(data.verifications)
        } else {
          console.error('Failed to fetch student verifications')
        }
      } catch (error) {
        console.error('Error fetching student verifications:', error)
      }
    }

    fetchDashboardData()
    fetchBestSellingProducts()
    fetchStudentVerifications()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Format currency
  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== "number") return "₨ 0"
    return `₨ ${value.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-bold">{dashboardData?.totalOrders || 0}</h3>
            <p className="text-xs text-green-500">All orders</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Revenue</p>
            <h3 className="text-2xl font-bold">{formatCurrency(dashboardData?.revenue?.totalRevenue || 0)}</h3>
            <p className="text-xs text-green-500">Avg. {formatCurrency(dashboardData?.revenue?.averageOrderValue || 0)}/order</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Student Users</p>
            <h3 className="text-2xl font-bold">{dashboardData?.studentUserCount || 0}</h3>
            <p className="text-xs text-green-500">Verified students</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Reward Points</p>
            <h3 className="text-2xl font-bold">{dashboardData?.totalPointsEarned || 0}</h3>
            <p className="text-xs text-gray-400">{dashboardData?.totalPointsUsed || 0} points used</p>
          </div>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
        </div>

        {/* Revenue Breakdown */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(dashboardData?.revenue?.totalRevenue || 0)}</h3>
            <div className="flex items-center text-green-500 text-sm mt-1">
              <span>Current total</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Student Discounts</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(dashboardData?.studentDiscounts?.totalAmount || 0)}</h3>
            <div className="flex items-center text-amber-500 text-sm mt-1">
              <span>{dashboardData?.studentDiscounts?.count || 0} orders</span>
              <span className="text-gray-400 ml-2">with student discount</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">First Order Discounts</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(dashboardData?.firstOrderDiscounts?.totalAmount || 0)}</h3>
            <div className="flex items-center text-blue-500 text-sm mt-1">
              <span>{dashboardData?.firstOrderDiscounts?.count || 0}</span>
              <span className="text-gray-400 ml-2">first time customers</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
          <div className="space-y-4">
            {bestSellingProducts.map(product => (
              <div key={product._id} className="flex items-center border-b border-gray-800 pb-3">
                <div className="h-16 w-16 bg-gray-800 rounded-md mr-4 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.unitsSold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₨ {product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Revenue</p>
                </div>
              </div>
            ))}
            {bestSellingProducts.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No bestselling products data available
              </div>
            )}
          </div>
        </Card>

        {/* Student Verification Requests */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Student Verifications</h2>
          <div className="space-y-4">
            {studentVerifications.map(verification => (
              <div key={verification._id} className="flex items-center border-b border-gray-800 pb-3">
                <div className="h-12 w-12 bg-gray-800 rounded-full mr-4 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{verification.name === "N/A" ? "Unknown Student" : verification.name}</h3>
                  <p className="text-sm text-gray-400">{verification.institutionName}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${verification.status === 'Approved' ? 'text-green-500' : 'text-amber-500'}`}>
                    {verification.status}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(verification.verificationDate)}</p>
                </div>
              </div>
            ))}
            {studentVerifications.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No student verifications available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}