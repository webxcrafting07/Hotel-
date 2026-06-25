"use client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, FileText, Heart, Star, ArrowRight, Clock } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import api from "@/lib/api"
import { Booking, Room } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings?limit=5")
      return res.data.data as Booking[]
    },
  })

  const { data: availableRooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["available-rooms"],
    queryFn: async () => {
      const res = await api.get("/rooms?status=AVAILABLE&limit=3")
      return res.data.data as Room[]
    },
  })

  const activeBookings = bookings?.filter((b) => ["CONFIRMED", "PENDING", "CHECKED_IN"].includes(b.status)) || []
  const completedBookings = bookings?.filter((b) => b.status === "CHECKED_OUT") || []

  const stats = [
    { label: "Total Bookings", value: bookings?.length || 0, icon: Calendar, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
    { label: "Active Stays", value: activeBookings.length, icon: Clock, color: "text-green-500 bg-green-50 dark:bg-green-500/10" },
    { label: "Stays Completed", value: completedBookings.length, icon: Star, color: "text-gold-500 bg-gold-50 dark:bg-gold-500/10" },
    { label: "Loyalty Points", value: user?.loyaltyPoints || 0, icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-500/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold-500 text-sm font-medium">Welcome back,</p>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your bookings, explore new stays, and enjoy exclusive member benefits.
            </p>
          </div>
          <Link href="/rooms" className="btn-gold hidden md:inline-flex">
            Book a Room <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="luxury-card p-5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-gold-500 text-sm hover:text-gold-600 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!bookings && isLoadingBookings ? (
          <p className="text-gray-500 dark:text-gray-400">Loading your bookings...</p>
        ) : !bookings?.length ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings yet</p>
            <Link href="/rooms" className="btn-gold text-sm">Browse Rooms</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gold-500/30 hover:bg-gold-50/30 dark:hover:bg-gold-500/5 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {booking.room?.name || "Room Booking"}
                    </p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                      booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                      booking.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                      booking.status === "CHECKED_OUT" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {booking.nights} night{booking.nights > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                  <p className="text-xs text-gray-400">{booking.bookingNumber}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Available Rooms */}
      <div className="luxury-card p-6 mt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">Available Rooms for Booking</h2>
          <Link href="/rooms" className="text-gold-500 text-sm hover:text-gold-600 flex items-center gap-1">
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!availableRooms && isLoadingRooms ? (
          <p className="text-gray-500 dark:text-gray-400">Loading available rooms...</p>
        ) : !availableRooms?.length ? (
          <p className="text-gray-500 dark:text-gray-400">No rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <div key={room.id} className="group border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-colors">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white truncate">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.roomType.replace("_", " ")}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(room.pricePerNight)}<span className="text-xs text-gray-500 font-normal">/night</span></p>
                    <Link href={`/rooms/${room.id}`} className="px-3 py-1.5 bg-gold-500 text-white text-xs rounded-lg hover:bg-gold-600 transition-colors shadow-gold">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
