import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Product Management",
    href: "/product-management",
    icon: Package
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "transparent"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
} 