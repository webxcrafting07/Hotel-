"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, XCircle, FileText, QrCode } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  CHECKED_IN: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  CHECKED_OUT: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
}

export default function BookingsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings?limit=50")
      return res.data.data as Booking[]
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.patch(`/bookings/${id}/cancel`, { reason }),
    onSuccess: () => { toast.success("Booking cancelled"); qc.invalidateQueries({ queryKey: ["my-bookings"] }) },
    onError: () => toast.error("Failed to cancel booking"),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data?.length || 0} bookings total</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="luxury-card p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !data?.length ? (
        <div className="luxury-card p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings yet</p>
          <Link href="/rooms" className="btn-gold text-sm">Browse Rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((booking, i) => (
            <motion.div key={booking.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="luxury-card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-gold-500">{booking.bookingNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status]}`}>
                      {booking.status}
                    </span>
                    {booking.paymentStatus === "PAID" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">PAID</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {booking.room?.name || "Room Booking"}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Check-in: {formatDate(booking.checkIn)}</span>
                    <span>Check-out: {formatDate(booking.checkOut)}</span>
                    <span>{booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
                    <span>{booking.adults} adult{booking.adults > 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} child${booking.children > 1 ? "ren" : ""}` : ""}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Paid: {formatCurrency(booking.paidAmount)} · GST incl.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.invoice && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 dark:border-white/10 rounded-lg hover:border-gold-500 text-gray-600 dark:text-gray-300 transition-colors">
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    )}
                    {booking.qrCode && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 dark:border-white/10 rounded-lg hover:border-gold-500 text-gray-600 dark:text-gray-300 transition-colors">
                        <QrCode className="w-3.5 h-3.5" /> QR
                      </button>
                    )}
                    {["PENDING","CONFIRMED"].includes(booking.status) && (
                      <button
                        onClick={() => {
                          const reason = prompt("Reason for cancellation:")
                          if (reason) cancelMutation.mutate({ id: booking.id, reason })
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
