"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Calendar, FileText, Heart, Bell, User, LogOut, Award, Menu, X
} from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luxury-darker flex print:bg-white">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-luxury-dark border-r border-gray-100 dark:border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto print:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/5">
            <Link href="/" className="font-serif text-xl font-bold">
              Hotel <span className="text-gold-500">The Anand</span>
            </Link>
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.firstName} width={40} height={40} className="rounded-full" />
                ) : (
                  <span className="text-gold-600 font-bold">{user.firstName[0]}{user.lastName[0]}</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.firstName} {user.lastName}</p>
                <div className="flex items-center gap-1 text-xs text-gold-500">
                  <Award className="w-3 h-3" />
                  {user.loyaltyPoints} points
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-gold-500 text-white shadow-gold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gold-500"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-white/5">
            <button
              onClick={() => { logout(); router.push("/") }}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden print:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 print:block">
        <header className="sticky top-0 z-30 bg-white dark:bg-luxury-dark border-b border-gray-100 dark:border-white/5 px-4 md:px-6 h-16 flex items-center gap-4 print:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg text-gray-500">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <Link href="/rooms" className="btn-gold text-sm py-2">Book a Room</Link>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto print:p-0 print:overflow-visible print:block">
          {children}
        </main>
      </div>
    </div>
  )
}
