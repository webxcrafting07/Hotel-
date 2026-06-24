"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Printer, ArrowLeft, Download } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`)
      return res.data.data as Booking
    },
    staleTime: 0,
    refetchOnMount: true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!booking || !booking.invoice) {
    return (
      <div className="text-center py-20 min-h-screen bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
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
          body { -webkit-print-color-adjust: exact; }
        }
      `}} />
      <div className="min-h-screen bg-gray-50 py-12 px-4 print:p-12 print:bg-white">
      {/* Controls - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gold-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm print:shadow-none print:border-none p-10 md:p-16">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">HOTEL THE ANAND</h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              123 Luxury Avenue, Sea Beach Road<br/>
              Puri, Odisha 752001<br/>
              Phone: +91 98765 43210<br/>
              Email: hoteltheanand5454@gmail.com
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-200 mb-2">INVOICE</h2>
            <p className="font-semibold text-gray-900">{booking.invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-500 mt-1">Date: {formatDate(booking.invoice.issueDate)}</p>
            <p className="text-sm text-gray-500">Booking Ref: #{booking.bookingNumber}</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between items-start py-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
            <p className="font-semibold text-gray-900">{booking.guestName}</p>
            <p className="text-sm text-gray-500">{booking.guestEmail}</p>
            <p className="text-sm text-gray-500">{booking.guestPhone}</p>
            {booking.guestAddress && <p className="text-sm text-gray-500 mt-1 max-w-xs">{booking.guestAddress}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stay Details</p>
            <p className="text-sm text-gray-900 font-medium">{formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}</p>
            <p className="text-sm text-gray-500">{booking.nights} Night{booking.nights > 1 ? "s" : ""} · {booking.adults} Adult{booking.adults > 1 ? "s" : ""}</p>
            <p className="text-sm text-gray-500 mt-1">Room: {booking.room?.name}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-900">Description</th>
                <th className="pb-3 font-semibold text-gray-900 text-center">Qty/Nights</th>
                <th className="pb-3 font-semibold text-gray-900 text-right">Rate</th>
                <th className="pb-3 font-semibold text-gray-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 border-b border-gray-200">
              <tr>
                <td className="py-4">
                  <p className="font-medium text-gray-900">{booking.room?.name}</p>
                  <p className="text-xs">{booking.room?.roomType.replace("_", " ")}</p>
                </td>
                <td className="py-4 text-center">{booking.nights}</td>
                <td className="py-4 text-right">{formatCurrency(parseFloat(booking.roomPrice.toString()) / booking.nights)}</td>
                <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(booking.roomPrice)}</td>
              </tr>
              {booking.extraBedPrice > 0 && (
                <tr>
                  <td className="py-4">
                    <p className="font-medium text-gray-900">Extra Bed</p>
                  </td>
                  <td className="py-4 text-center">{booking.nights}</td>
                  <td className="py-4 text-right">{formatCurrency(parseFloat(booking.extraBedPrice.toString()) / booking.nights)}</td>
                  <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(booking.extraBedPrice)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-sm space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(booking.invoice.subtotal)}</span>
            </div>
            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
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
            <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg text-gray-900">
              <span>Total Amount</span>
              <span>{formatCurrency(booking.invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>This is a computer generated invoice and does not require a physical signature.</p>
          <p className="mt-1">Thank you for choosing Hotel The Anand!</p>
        </div>

      </div>
    </div>
    </>
  )
}
