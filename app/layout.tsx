"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, ChevronDown, Globe, LayoutDashboard, LogOut, Package, Settings, Wallet, Image as ImageIcon, Palette, Mail, Menu, X } from "lucide-react"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://steth-backend.onrender.com/api/users/profile-admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch profile`);
        }
        
        const data = await response.json()
        
        // Handle different possible response structures
        const user = data.user || data;
        if (user && user.email) {
          setUserData(user)
        } else {
          console.error('No user data received from API')
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1023) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      // Redirect to login page
      window.location.href = 'https://stethset.com/login';
    } catch (e: any) {
      console.error('Error during logout:', e.message);
      // Force redirect even if localStorage fails
      window.location.href = 'https://stethset.com/login';
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const getPageTitle = () => {
    switch(pathname) {
      case "/": return "Dashboard"
      case "/product-management": return "Product Management"
      case "/student-approval": return "Student Approval"
      case "/orders": return "Orders"
      case "/hero-images": return "Hero Image Management"
      case "/color-tiles": return "Color Tiles"
      case "/newsletter": return "Newsletter Management"
      case "/settings": return "Settings"
      default: return ""
    }
  }

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen bg-black text-white">
          <div className="lg:grid lg:grid-cols-[280px_1fr]">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="STETH" className="h-6 w-6" />
                <span className="font-bold">STETH</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Sidebar Overlay for mobile */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={closeSidebar}
              />
            )}

            {/* Sidebar */}
            <aside className={`
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
              lg:translate-x-0 
              fixed lg:static 
              top-0 left-0 
              w-[280px] lg:w-auto 
              h-full lg:h-screen 
              border-r bg-background/50 backdrop-blur 
              flex flex-col 
              z-50 lg:z-auto
              transition-transform duration-300 ease-in-out
            `}>
              {/* Mobile close button */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="STETH" className="h-6 w-6" />
                  <span className="font-bold">STETH</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSidebar}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Desktop header */}
              <div className="hidden lg:flex h-16 mb-4 items-center gap-2 border-b px-6">
                <img src="/logo.png" alt="STETH" className="h-6 w-6" />
                <span className="font-bold">STETH</span>
              </div>

              <nav className="space-y-2 px-2 flex-1 overflow-y-auto">
                <Link href="/" passHref>
                  <Button 
                    variant={isActivePath("/") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/product-management" passHref>
                  <Button 
                    variant={isActivePath("/product-management") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Product Management
                  </Button>
                </Link>
                <Link href="/student-approval" passHref>
                  <Button 
                    variant={isActivePath("/student-approval") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <Globe className="h-4 w-4" />
                    Student Approval
                  </Button>
                </Link>
                <Link href="/orders" passHref>
                  <Button 
                    variant={isActivePath("/orders") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                  <Package className="h-4 w-4" />
                  Orders
                  </Button>
                </Link>
                <Link href="/hero-images" passHref>
                  <Button 
                    variant={isActivePath("/hero-images") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Hero Images
                  </Button>
                </Link>
                <Link href="/color-tiles" passHref>
                  <Button 
                    variant={isActivePath("/color-tiles") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <Palette className="h-4 w-4" />
                    Color Tiles
                  </Button>
                </Link>
                <Link href="/newsletter" passHref>
                  <Button 
                    variant={isActivePath("/newsletter") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <Mail className="h-4 w-4" />
                    Newsletter
                  </Button>
                </Link>
                <Link href="/settings" passHref>
                  <Button 
                    variant={isActivePath("/settings") ? "default" : "ghost"} 
                    className="w-full justify-start gap-2"
                    onClick={closeSidebar}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <div className="px-2 pb-4 mt-auto">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={() => {
                      handleLogout()
                      closeSidebar()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div> 
              </nav>
            </aside>

            <main className="p-4 lg:p-6">
              <div className="mb-6 flex items-center justify-between relative">
                <div className="space-y-1">
                  <h1 className="text-xl lg:text-2xl font-bold">
                    {getPageTitle()}
                  </h1>
                </div>
                <div className="relative">
                  {isLoading ? (
                    <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gray-700 animate-pulse" />
                  ) : (
                    <img 
                      src={userData?.profilePicUrl || "/pfp.jpg"} 
                      alt="profile" 
                      className="h-8 w-8 lg:h-10 lg:w-10 rounded-full cursor-pointer object-cover" 
                      onClick={() => setShowLogout(!showLogout)}
                    />
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