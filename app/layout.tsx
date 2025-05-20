"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, ChevronDown, Globe, LayoutDashboard, LogOut, Package, Settings, Wallet, Image as ImageIcon, Palette, Mail } from "lucide-react"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDY2YWI0M2JlMjJkMzA3MWFhY2FiMCIsInVzZXJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTg3MTAwOSwiZXhwIjoxNzQ1ODg5MDA5fQ.R7nPOFK4JsxiuULIDRhP1JhO0nvveWmHYZuITxx4rBw"

interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicUrl: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [showLogout, setShowLogout] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://steth-backend.onrender.com/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`
          }
        })
        const data = await response.json()
        if (data.user) {
          setUserData(data.user)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logged out")
    setShowLogout(false)
  }

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen bg-black text-white">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <aside className="border-r bg-background/50 backdrop-blur h-screen flex flex-col">
              <div className="flex h-16 mb-4 items-center gap-2 border-b px-6">
                <img src="/logo.png" alt="STETH" className="h-6 w-6" />
                <span className="font-bold">STETH</span>
              </div>
              <nav className="space-y-2 px-2 flex-1">
                <Link href="/" passHref>
                  <Button 
                    variant={isActivePath("/") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/product-management" passHref>
                  <Button 
                    variant={isActivePath("/product-management") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Product Management
                  </Button>
                </Link>
                <Link href="/student-approval" passHref>
                  <Button 
                    variant={isActivePath("/student-approval") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Student Approval
                  </Button>
                </Link>
                <Link href="/orders" passHref>
                  <Button 
                    variant={isActivePath("/orders") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                  <Package className="h-4 w-4" />
                  Orders
                  </Button>
                </Link>
                <Link href="/hero-images" passHref>
                  <Button 
                    variant={isActivePath("/hero-images") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Hero Images
                  </Button>
                </Link>
                <Link href="/color-tiles" passHref>
                  <Button 
                    variant={isActivePath("/color-tiles") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    Color Tiles
                  </Button>
                </Link>
                <Link href="/newsletter" passHref>
                  <Button 
                    variant={isActivePath("/newsletter") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Newsletter
                  </Button>
                </Link>
                <Link href="/settings" passHref>
                  <Button 
                    variant={isActivePath("/settings") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                {/* Logout button at bottom of sidebar */}
                <div className="px-2 pb-4 mt-auto">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </nav>
            </aside>
            <main className="p-6">
              <div className="mb-6 flex items-center justify-between relative">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">
                    {pathname === "/" ? "Dashboard" : 
                    pathname === "/product-management" ? "Product Management" :
                    pathname === "/student-approval" ? "Student Approval" :
                    pathname === "/hero-images" ? "Hero Image Management" :
                    pathname === "/newsletter" ? "Newsletter Management" :
                    pathname === "/settings" ? "Settings" : ""}
                  </h1>
                </div>
                <div className="relative">
                  {isLoading ? (
                    <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
                  ) : (
                    <img 
                      src={userData?.profilePicUrl || "/pfp.jpg"} 
                      alt="profile" 
                      className="h-10 w-10 rounded-full cursor-pointer object-cover" 
                      onClick={() => setShowLogout(!showLogout)}
                    />
                  )}
                  {showLogout && (
                    <div className="absolute z-10 right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg">
                      <button 
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}