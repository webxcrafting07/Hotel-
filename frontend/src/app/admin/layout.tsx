"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Bed, CalendarCheck, Users, Image, FileText,
  BarChart3, Sparkles, UtensilsCrossed, Home, Settings, LogOut, Menu, X, ChevronDown, QrCode
} from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"

const adminRoles = ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST", "HOUSEKEEPING", "ACCOUNTANT"]

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST", "HOUSEKEEPING", "ACCOUNTANT"] },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "MANAGER", "ACCOUNTANT"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/rooms", label: "Rooms", icon: Bed, roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, roles: ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST", "ACCOUNTANT"] },
      { href: "/admin/scan", label: "Scan QR", icon: QrCode, roles: ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"] },
      { href: "/admin/housekeeping", label: "Housekeeping", icon: Home, roles: ["SUPER_ADMIN", "MANAGER", "HOUSEKEEPING", "RECEPTIONIST"] },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/gallery", label: "Gallery", icon: Image, roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/blogs", label: "Blogs", icon: FileText, roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/admin/spa", label: "Spa", icon: Sparkles, roles: ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"] },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, roles: ["SUPER_ADMIN", "MANAGER"] },
      { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    if (user && !adminRoles.includes(user.role)) router.push("/dashboard")
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user || !adminRoles.includes(user.role)) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-darker flex">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-luxury-dark border-r border-gray-100 dark:border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
          <Link href="/" className="font-serif text-lg font-bold">
            Hotel <span className="text-gold-500">The Anand</span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-gold-50 dark:bg-gold-500/10">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gold-600 dark:text-gold-400">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => {
            const allowedItems = group.items.filter((item) => item.roles.includes(user.role))
            if (allowedItems.length === 0) return null

            return (
              <div key={group.label}>
                <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {allowedItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href))
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "bg-gold-500 text-white shadow-gold"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gold-500"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
            <Home className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={() => { logout(); router.push("/") }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-luxury-dark border-b border-gray-100 dark:border-white/5 flex items-center gap-4 px-4 md:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
