"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, User, CreditCard, Home, Calendar, Phone, Mail, MapPin, FileImage } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function AdminBookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const { data: booking, isLoading } = useQuery({
    queryKey: ["admin-booking", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`)
      return res.data.data as Booking
    },
    staleTime: 0,
    refetchOnMount: true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-20 min-h-screen">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking not found</h2>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-gold-500 text-white rounded-lg">Go Back</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/bookings")} className="p-2 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gold-500 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Booking Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ref: #{booking.bookingNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
            booking.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {booking.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
          }`}>
            Payment: {booking.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Guest Information */}
        <div className="luxury-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gold-500" /> Guest Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.guestEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.guestPhone || "N/A"}</p>
              </div>
            </div>
            {booking.guestAddress && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.guestAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stay Details */}
        <div className="luxury-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-gold-500" /> Stay Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Room</p>
              <p className="font-medium text-gray-900 dark:text-white">{booking.room?.name} ({booking.room?.roomType})</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-in</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Check-out</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nights</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.nights}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adults/Children</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.adults} / {booking.children}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Extra Beds</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.extraBeds}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payment & Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Summary */}
        <div className="luxury-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gold-500" /> Payment Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Room Total</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.roomPrice)}</span>
            </div>
            {booking.extraBedPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Extra Bed</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.extraBedPrice)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Taxes (GST)</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.taxAmount)}</span>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between font-bold text-lg">
              <span className="text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-gold-500">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Identity Verification */}
        <div className="luxury-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-gold-500" /> Identity Verification
          </h2>
          
          <div className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">ID Proof Type: </span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.idProofType || "Not Specified"}</span>
          </div>

          {booking.idProofUrl ? (
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5">
              {booking.idProofUrl.endsWith('.pdf') ? (
                <div className="p-8 text-center">
                  <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <a href={booking.idProofUrl} target="_blank" rel="noreferrer" className="text-gold-500 hover:underline font-medium">
                    View PDF Document
                  </a>
                </div>
              ) : (
                <a href={booking.idProofUrl} target="_blank" rel="noreferrer" className="block relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={booking.idProofUrl} alt="ID Proof" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-medium">Click to View Full Image</span>
                  </div>
                </a>
              )}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No ID proof document uploaded.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
