"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, Moon, Sun, ChevronDown, Bell, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  {
    label: "Explore",
    children: [
      { href: "/gallery", label: "Gallery" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About Us" },
    ],
  },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHome = pathname === "/"

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-white/95 dark:bg-luxury-dark/95 backdrop-blur-md shadow-lg border-b border-gold-500/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span
              className={cn(
                "font-serif text-xl font-bold tracking-widest transition-colors duration-300",
                scrolled || !isHome ? "text-gray-900 dark:text-white" : "text-white"
              )}
            >
              HOTEL
            </span>
            <span className="text-gold-500 font-serif text-2xl font-bold tracking-wider -mt-1">
              THE ANAND
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                      scrolled || !isHome
                        ? "text-gray-700 dark:text-gray-200 hover:text-gold-500"
                        : "text-white/90 hover:text-white"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-luxury-card rounded-xl shadow-xl border border-gold-500/20 py-2 overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:text-gold-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    pathname === link.href ? "text-gold-500" : "",
                    scrolled || !isHome
                      ? "text-gray-700 dark:text-gray-200 hover:text-gold-500"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled || !isHome
                  ? "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {isMounted ? (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <div className="w-4 h-4" />}
            </button>

            <a
              href="tel:+919296985454"
              className={cn(
                "hidden md:flex items-center gap-2 text-sm font-medium transition-colors",
                scrolled || !isHome ? "text-gray-700 dark:text-gray-200" : "text-white/90"
              )}
            >
              <Phone className="w-4 h-4 text-gold-500" />
              +91-9296985454
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/notifications"
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    scrolled || !isHome ? "text-gray-600 dark:text-gray-300" : "text-white/80"
                  )}
                >
                  <Bell className="w-4 h-4" />
                </Link>
                <Link
                  href={user?.role === "CUSTOMER" ? "/dashboard" : "/admin"}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    scrolled || !isHome ? "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <Link 
                href="/login" 
                className={cn(
                  "hidden md:inline-flex text-sm font-medium transition-colors mr-2",
                  scrolled || !isHome ? "text-gray-700 hover:text-gold-500 dark:text-gray-200" : "text-white/90 hover:text-white"
                )}
              >
                Sign In
              </Link>
            )}

            <Link href="/rooms" className="btn-gold text-sm py-2 hidden md:inline-flex">
              Book Now
            </Link>

            <button
              className={cn(
                "lg:hidden p-2 rounded-lg",
                scrolled || !isHome ? "text-gray-700 dark:text-gray-200" : "text-white"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-luxury-dark border-t border-gold-500/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-semibold text-gold-500 uppercase tracking-wider">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-6 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-gold-500 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-gold-500 bg-gold-50 dark:bg-gold-500/10"
                        : "text-gray-700 dark:text-gray-200 hover:text-gold-500"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 dark:text-gray-200 hover:text-gold-500"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/rooms"
                onClick={() => setIsOpen(false)}
                className="btn-gold w-full justify-center mt-3"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
