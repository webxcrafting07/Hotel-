"use client"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  TrendingUp, TrendingDown, Bed, Users, DollarSign, CalendarCheck,
  CheckCircle, Clock, AlertCircle, ArrowRight, RefreshCw
} from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

import { useAuthStore } from "@/store/auth.store"

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard")
      return res.data.data
    },
    refetchInterval: 60000,
  })

  const { data: todayData } = useQuery({
    queryKey: ["today-activity"],
    queryFn: async () => {
      const res = await api.get("/bookings/today")
      return res.data.data
    },
    refetchInterval: 30000,
  })

  const overview = data?.overview

  const statCards = overview ? [
    {
      title: "Monthly Revenue",
      value: formatCurrency(overview.monthlyRevenue),
      sub: `${overview.revenueGrowth > 0 ? "+" : ""}${overview.revenueGrowth}% vs last month`,
      icon: DollarSign,
      trend: overview.revenueGrowth > 0,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      title: "Occupancy Rate",
      value: `${overview.occupancyRate}%`,
      sub: `${overview.occupiedRooms} of ${overview.totalRooms} rooms occupied`,
      icon: Bed,
      trend: overview.occupancyRate > 60,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Total Bookings",
      value: overview.totalBookings,
      sub: `${overview.pendingBookings} pending confirmation`,
      icon: CalendarCheck,
      trend: true,
      color: "text-gold-500",
      bg: "bg-gold-50 dark:bg-gold-500/10",
    },
    {
      title: "Total Customers",
      value: overview.totalCustomers,
      sub: "Registered guests",
      icon: Users,
      trend: true,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
  ] : []

  // Hide Revenue and Customers from Receptionist & Housekeeping
  const allowedCards = statCards.filter(card => {
    if ((card.title === "Monthly Revenue" || card.title === "Total Customers") && (user?.role === "RECEPTIONIST" || user?.role === "HOUSEKEEPING")) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hotel The Anand — Operations Overview</p>
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gold-500 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Today quick stats */}
      {todayData && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today's Check-ins", value: todayData.checkIns, icon: CheckCircle, color: "text-green-500" },
            { label: "Today's Check-outs", value: todayData.checkOuts, icon: Clock, color: "text-blue-500" },
            { label: "New Bookings Today", value: todayData.newBookings, icon: AlertCircle, color: "text-gold-500" },
          ].map((item) => (
            <div key={item.label} className="luxury-card p-4 text-center">
              <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="luxury-card p-6 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {allowedCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="luxury-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.trend ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{card.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="luxury-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-gold-500 text-sm flex items-center gap-1 hover:text-gold-600">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-white/5">
                <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking #</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guest</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {data?.recentBookings?.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  <td className="py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{booking.bookingNumber}</td>
                  <td className="py-3 text-gray-900 dark:text-white">{booking.user?.firstName} {booking.user?.lastName}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{booking.room?.name}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                      booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                      booking.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                      "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(booking.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/admin/rooms", label: "Manage Rooms", icon: Bed },
          { href: "/admin/bookings", label: "All Bookings", icon: CalendarCheck },
          { href: "/admin/users", label: "Manage Users", icon: Users },
          { href: "/admin/analytics", label: "View Reports", icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="luxury-card p-5 flex flex-col items-center gap-3 text-center hover:border-gold-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
              <Icon className="w-5 h-5 text-gold-500 group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
