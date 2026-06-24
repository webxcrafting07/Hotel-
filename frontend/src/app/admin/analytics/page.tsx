"use client"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#C9A84C", "#1a1a2e", "#16213e", "#0f3460", "#e8c878"]

export default function AdminAnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard")
      return res.data.data
    },
  })

  const { data: roomAnalytics } = useQuery({
    queryKey: ["analytics-rooms"],
    queryFn: async () => {
      const res = await api.get("/analytics/rooms")
      return res.data.data
    },
  })

  const overview = dashboard?.overview

  const kpiCards = overview ? [
    { label: "Yearly Revenue", value: formatCurrency(overview.yearlyRevenue), sub: "Current year" },
    { label: "Monthly Revenue", value: formatCurrency(overview.monthlyRevenue), sub: `${overview.revenueGrowth > 0 ? "+" : ""}${overview.revenueGrowth}% growth` },
    { label: "Occupancy Rate", value: `${overview.occupancyRate}%`, sub: `${overview.occupiedRooms}/${overview.totalRooms} rooms` },
    { label: "Total Customers", value: overview.totalCustomers.toLocaleString(), sub: "All time" },
  ] : []

  const topRooms = roomAnalytics?.sort((a: any, b: any) => b.totalRevenue - a.totalRevenue).slice(0, 5) || []
  const roomTypeData = roomAnalytics?.reduce((acc: any[], room: any) => {
    const existing = acc.find((r) => r.name === room.roomType)
    if (existing) { existing.revenue += room.totalRevenue; existing.bookings += room.totalBookings }
    else acc.push({ name: room.roomType.replace("_"," "), revenue: room.totalRevenue, bookings: room.totalBookings })
    return acc
  }, []) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Performance insights and reports</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }}
            className="luxury-card p-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
            <p className="text-xs text-gold-500">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Room Type */}
        <div className="luxury-card p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Revenue by Room Type</h2>
          {roomTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roomTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [formatCurrency(v), "Revenue"]} />
                <Bar dataKey="revenue" fill="#C9A84C" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>

        {/* Bookings by Room Type Pie */}
        <div className="luxury-card p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Bookings Distribution</h2>
          {roomTypeData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="bookings" label={false}>
                    {roomTypeData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v, "Bookings"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {roomTypeData.map((item: any, i: number) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    <span className="text-gray-900 dark:text-white font-medium ml-auto">{item.bookings}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Top Performing Rooms */}
      <div className="luxury-card p-6">
        <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Top Performing Rooms</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-white/5">
                {["Rank","Room","Type","Total Bookings","Total Nights","Revenue"].map((h) => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {topRooms.map((room: any, i: number) => (
                <tr key={room.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2">
                  <td className="py-3 pr-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gold-500 text-white" : i === 1 ? "bg-gray-300 text-gray-800" : i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{room.name}</td>
                  <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{room.roomType?.replace("_"," ")}</td>
                  <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{room.totalBookings}</td>
                  <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">{room.totalNights}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{formatCurrency(room.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
