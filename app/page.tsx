"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingBag, Users, TrendingUp, CreditCard, Award, Calendar } from "lucide-react"
import { useState } from "react"

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState("thisMonth")
  
  // Mock data for charts and stats
  const revenueData = [
    { month: 'Jan', revenue: 15400 },
    { month: 'Feb', revenue: 18200 },
    { month: 'Mar', revenue: 16800 },
    { month: 'Apr', revenue: 21500 },
    { month: 'May', revenue: 24600 },
    { month: 'Jun', revenue: 22300 },
    { month: 'Jul', revenue: 28900 }
  ]
  
  // Top selling products data
  const topProducts = [
    { id: 1, name: "Premium Scrubs Set - Navy", sales: 142, revenue: 12780, image: "/product1.jpg" },
    { id: 2, name: "Medical Face Mask - White", sales: 238, revenue: 8568, image: "/product2.jpg" },
    { id: 3, name: "Surgical Cap - Blue", sales: 97, revenue: 4365, image: "/product3.jpg" },
  ]
  
  // Recent student verifications
  const recentVerifications = [
    { id: 1, name: "Aisha Khan", university: "King Edward Medical University", status: "pending", date: "Apr 12, 2025" },
    { id: 2, name: "Hassan Ali", university: "Aga Khan University", status: "approved", date: "Apr 11, 2025" },
    { id: 3, name: "Fatima Zahra", university: "Dow University", status: "pending", date: "Apr 10, 2025" },
  ]

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
            <h3 className="text-2xl font-bold">1,247</h3>
            <p className="text-xs text-green-500">+12% from last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Revenue</p>
            <h3 className="text-2xl font-bold">₨ 574,320</h3>
            <p className="text-xs text-green-500">+8% from last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Student Users</p>
            <h3 className="text-2xl font-bold">863</h3>
            <p className="text-xs text-green-500">+15% from last month</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Reward Points</p>
            <h3 className="text-2xl font-bold">24,680</h3>
            <p className="text-xs text-gray-400">Issued this month</p>
          </div>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
          {/* <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={timeFilter === "thisWeek" ? "default" : "ghost"}
              onClick={() => setTimeFilter("thisWeek")}
            >
              This Week
            </Button>
            <Button 
              size="sm" 
              variant={timeFilter === "thisMonth" ? "default" : "ghost"}
              onClick={() => setTimeFilter("thisMonth")}
            >
              This Month
            </Button>
            <Button 
              size="sm" 
              variant={timeFilter === "lastQuarter" ? "default" : "ghost"}
              onClick={() => setTimeFilter("lastQuarter")}
            >
              Last Quarter
            </Button>
            <Button 
              size="sm" 
              variant={timeFilter === "thisYear" ? "default" : "ghost"}
              onClick={() => setTimeFilter("thisYear")}
            >
              This Year
            </Button>
          </div> */}
        </div>
        
        {/* Chart Placeholder */}
        {/* <div className="h-64 w-full bg-gray-900 rounded-lg flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-gray-600" />
          <p className="ml-2 text-gray-500">Revenue Chart Visualization</p>
        </div> */}

        {/* Revenue Breakdown */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">₨ 574,320</h3>
            <div className="flex items-center text-green-500 text-sm mt-1">
              <span>+8%</span>
              <span className="text-gray-400 ml-2">vs last period</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Student Discounts</p>
            <h3 className="text-2xl font-bold mt-1">₨ 28,716</h3>
            <div className="flex items-center text-amber-500 text-sm mt-1">
              <span>5%</span>
              <span className="text-gray-400 ml-2">of total revenue</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">First Order Discounts</p>
            <h3 className="text-2xl font-bold mt-1">₨ 42,150</h3>
            <div className="flex items-center text-blue-500 text-sm mt-1">
              <span>10%</span>
              <span className="text-gray-400 ml-2">for 98 new customers</span>
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
            {topProducts.map(product => (
              <div key={product.id} className="flex items-center border-b border-gray-800 pb-3">
                <div className="h-16 w-16 bg-gray-800 rounded-md mr-4 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₨ {product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Revenue</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Products</Button>
        </Card>

        {/* Student Verification Requests */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Student Verifications</h2>
          <div className="space-y-4">
            {recentVerifications.map(student => (
              <div key={student.id} className="flex items-center border-b border-gray-800 pb-3">
                <div className="h-12 w-12 bg-gray-800 rounded-full mr-4 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-400">{student.university}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${student.status === 'approved' ? 'text-green-500' : 'text-amber-500'}`}>
                    {student.status === 'approved' ? 'Approved' : 'Pending'}
                  </p>
                  <p className="text-xs text-gray-400">{student.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Verifications</Button>
        </Card>
      </div>

      {/* Recent Orders */}
      {/* <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Products</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-800">
                <td className="py-3">#ORD-7865</td>
                <td className="py-3">Sana Malik</td>
                <td className="py-3">3 items</td>
                <td className="py-3">₨ 4,320</td>
                <td className="py-3"><span className="px-2 py-1 text-xs bg-green-900/30 text-green-500 rounded-full">Delivered</span></td>
                <td className="py-3">Apr 14, 2025</td>
                <td className="py-3"><Button size="sm" variant="ghost">View</Button></td>
              </tr>
              <tr className="border-t border-gray-800">
                <td className="py-3">#ORD-7864</td>
                <td className="py-3">Ahmed Khan</td>
                <td className="py-3">1 item</td>
                <td className="py-3">₨ 1,850</td>
                <td className="py-3"><span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-500 rounded-full">Processing</span></td>
                <td className="py-3">Apr 14, 2025</td>
                <td className="py-3"><Button size="sm" variant="ghost">View</Button></td>
              </tr>
              <tr className="border-t border-gray-800">
                <td className="py-3">#ORD-7863</td>
                <td className="py-3">Zainab Ali</td>
                <td className="py-3">2 items</td>
                <td className="py-3">₨ 3,600</td>
                <td className="py-3"><span className="px-2 py-1 text-xs bg-amber-900/30 text-amber-500 rounded-full">Packed</span></td>
                <td className="py-3">Apr 13, 2025</td>
                <td className="py-3"><Button size="sm" variant="ghost">View</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button variant="outline" className="w-full mt-4">View All Orders</Button>
      </Card> */}
    </div>
  )
}