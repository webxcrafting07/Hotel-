"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Printer, ArrowLeft, Mail } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import { useState } from "react"

export default function AdminInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string
  const [isEmailing, setIsEmailing] = useState(false)

  const { data: booking, isLoading } = useQuery({
    queryKey: ["admin-booking", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`)
      return res.data.data as Booking
    },
    staleTime: 0,
    refetchOnMount: true
  })

  const emailMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/bookings/${bookingId}/send-invoice`)
    },
    onMutate: () => setIsEmailing(true),
    onSuccess: () => {
      toast.success("Invoice emailed successfully to the guest")
      setIsEmailing(false)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send email")
      setIsEmailing(false)
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!booking || !booking.invoice) {
    return (
      <div className="text-center py-20 min-h-screen bg-gray-50 dark:bg-black">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice not found</h2>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-gold-500 text-white rounded-lg">Go Back</button>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; background: white !important; }
        }
      `}} />
      <div className="min-h-screen bg-gray-50 dark:bg-black/50 py-12 px-4 print:p-12 print:bg-white print:text-black">
      {/* Controls - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-between items-center">
        <button onClick={() => router.push("/admin/bookings")} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gold-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => emailMutation.mutate()} 
            disabled={isEmailing}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4" /> {isEmailing ? "Sending..." : "Email to Guest"}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm print:shadow-none print:border-none p-10 md:p-16 print:!bg-white print:!text-black">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 dark:border-white/10 print:!border-gray-200 pb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white print:!text-black">HOTEL THE ANAND</h1>
            <p className="text-gray-500 dark:text-gray-400 print:!text-gray-600 text-sm mt-2 max-w-xs">
              123 Luxury Avenue, Sea Beach Road<br/>
              Puri, Odisha 752001<br/>
              Phone: +91 98765 43210<br/>
              Email: hoteltheanand5454@gmail.com
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-200 dark:text-white/10 print:!text-gray-300 mb-2">INVOICE</h2>
            <p className="font-semibold text-gray-900 dark:text-white print:!text-black">{booking.invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-500 mt-1">Date: {formatDate(booking.invoice.issueDate)}</p>
            <p className="text-sm text-gray-500">Booking Ref: #{booking.bookingNumber}</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between items-start py-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
            <p className="font-semibold text-gray-900 dark:text-white print:!text-black">{booking.guestName}</p>
            <p className="text-sm text-gray-500 print:!text-gray-600">{booking.guestEmail}</p>
            <p className="text-sm text-gray-500 print:!text-gray-600">{booking.guestPhone}</p>
            {booking.guestAddress && <p className="text-sm text-gray-500 mt-1 max-w-xs print:!text-gray-600">{booking.guestAddress}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stay Details</p>
            <p className="text-sm text-gray-900 dark:text-white print:!text-black font-medium">{formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}</p>
            <p className="text-sm text-gray-500 print:!text-gray-600">{booking.nights} Night{booking.nights > 1 ? "s" : ""} · {booking.adults} Adult{booking.adults > 1 ? "s" : ""}</p>
            <p className="text-sm text-gray-500 mt-1 print:!text-gray-600">Room: {booking.room?.name}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 print:!border-gray-200">
                <th className="pb-3 font-semibold text-gray-900 dark:text-white print:!text-black">Description</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-white print:!text-black text-center">Qty/Nights</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-white print:!text-black text-right">Rate</th>
                <th className="pb-3 font-semibold text-gray-900 dark:text-white print:!text-black text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-300 print:!text-gray-700 border-b border-gray-200 dark:border-white/10 print:!border-gray-200">
              <tr>
                <td className="py-4">
                  <p className="font-medium text-gray-900 dark:text-white print:!text-black">{booking.room?.name}</p>
                  <p className="text-xs">{booking.room?.roomType.replace("_", " ")}</p>
                </td>
                <td className="py-4 text-center">{booking.nights}</td>
                <td className="py-4 text-right">{formatCurrency(parseFloat(booking.roomPrice.toString()) / booking.nights)}</td>
                <td className="py-4 text-right font-medium text-gray-900 dark:text-white print:!text-black">{formatCurrency(booking.roomPrice)}</td>
              </tr>
              {booking.extraBedPrice > 0 && (
                <tr>
                  <td className="py-4">
                    <p className="font-medium text-gray-900 dark:text-white print:!text-black">Extra Bed</p>
                  </td>
                  <td className="py-4 text-center">{booking.nights}</td>
                  <td className="py-4 text-right">{formatCurrency(parseFloat(booking.extraBedPrice.toString()) / booking.nights)}</td>
                  <td className="py-4 text-right font-medium text-gray-900 dark:text-white print:!text-black">{formatCurrency(booking.extraBedPrice)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-sm space-y-3 text-sm text-gray-600 dark:text-gray-300 print:!text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(booking.invoice.subtotal)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-green-600 print:!text-green-700">
                <span>Discount</span>
                <span>-{formatCurrency(booking.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span>{formatCurrency(booking.invoice.cgst)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span>{formatCurrency(booking.invoice.sgst)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-white/10 print:!border-gray-200 font-bold text-lg text-gray-900 dark:text-white print:!text-black">
              <span>Total Amount</span>
              <span>{formatCurrency(booking.invoice.total)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-white/10 print:!border-gray-200 font-medium">
              <span>Status</span>
              <span className={booking.paymentStatus === 'PAID' ? 'text-green-600 print:!text-green-700' : 'text-red-500 print:!text-red-600'}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-white/10 print:!border-gray-200 text-center text-xs text-gray-400 print:!text-gray-500">
          <p>This is a computer generated invoice and does not require a physical signature.</p>
          <p className="mt-1">Thank you for choosing Hotel The Anand!</p>
        </div>

      </div>
    </div>
    </>
  )
}
