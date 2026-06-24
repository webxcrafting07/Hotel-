"use client"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { FileText, Download, CheckCircle, Clock, XCircle } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function InvoicesPage() {
  const router = useRouter()
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["user-bookings-invoices"],
    queryFn: async () => {
      const res = await api.get("/bookings")
      return res.data.data as Booking[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // Only show bookings that have a valid payment status or are confirmed
  const invoiceBookings = bookings?.filter(b => b.status !== "PENDING" && b.status !== "CANCELLED" && b.paymentStatus !== "PENDING") || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Payment History & Invoices</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View your past transactions and download receipts</p>
      </div>

      <div className="luxury-card p-6">
        {!invoiceBookings.length ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No payment history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 font-medium">
                  <th className="pb-4 pr-4">Invoice #</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4">Room</th>
                  <th className="pb-4 px-4">Amount</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {invoiceBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 font-mono font-medium text-gray-900 dark:text-white">
                      {booking.invoice?.invoiceNumber || `INV-${booking.bookingNumber}`}
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {booking.room?.name || "Room Booking"}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {booking.paymentStatus === "PAID" ? (
                          <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600 dark:text-green-400 font-medium">Paid</span></>
                        ) : booking.paymentStatus === "PARTIAL" ? (
                          <><Clock className="w-4 h-4 text-yellow-500" /><span className="text-yellow-600 dark:text-yellow-400 font-medium">Partial</span></>
                        ) : booking.paymentStatus === "FAILED" ? (
                          <><XCircle className="w-4 h-4 text-red-500" /><span className="text-red-600 dark:text-red-400 font-medium">Failed</span></>
                        ) : (
                          <span className="text-gray-500">{booking.paymentStatus}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button 
                        onClick={() => router.push(`/dashboard/invoices/${booking.id}`)}
                        className="text-gold-500 hover:text-gold-600 transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
