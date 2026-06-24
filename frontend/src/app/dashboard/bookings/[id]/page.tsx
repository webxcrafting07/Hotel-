"use client"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Clock, FileText, CheckCircle, XCircle } from "lucide-react"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth.store"

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const bookingId = params.id as string
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`)
      return res.data.data as Booking
    },
    staleTime: 0,
    refetchOnMount: true
  })

  const handlePayment = async () => {
    if (!booking) return
    setIsProcessing(true)
    
    try {
      // 1. Create Razorpay order on backend
      const orderRes = await api.post("/payments/razorpay/order", {
        bookingId: booking.id,
        amount: booking.totalAmount,
      })
      
      const { orderId, amount, currency, keyId } = orderRes.data.data

      // 2. Initialize Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Hotel The Anand",
        description: `Payment for Booking #${booking.bookingNumber}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
            })
            
            toast.success("Payment successful!")
            queryClient.invalidateQueries({ queryKey: ["booking", bookingId] })
          } catch (error) {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: booking.guestName || `${user?.firstName} ${user?.lastName}`,
          email: booking.guestEmail || user?.email,
          contact: booking.guestPhone || user?.phone || "",
        },
        theme: {
          color: "#C9A84C"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`)
      })
      
      rzp.open()

    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking not found</h2>
        <p className="text-gray-500 mt-2 mb-6">The booking you are looking for does not exist or you don't have access.</p>
        <button onClick={() => router.push("/dashboard/bookings")} className="btn-gold">Go Back</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <Link href="/dashboard/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Booking #{booking.bookingNumber}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Booked on {formatDate(booking.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            booking.status === "CONFIRMED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
            booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
            booking.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
            booking.status === "CHECKED_OUT" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
            "bg-gray-100 text-gray-700"
          }`}>
            {booking.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            booking.paymentStatus === "PAID" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
            booking.paymentStatus === "PARTIAL" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
            booking.paymentStatus === "FAILED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
            "bg-gray-100 text-gray-700"
          }`}>
            PAYMENT: {booking.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Stay Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check In</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  {formatDate(booking.checkIn)}
                </div>
                <p className="text-xs text-gray-400 mt-1">From 2:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check Out</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  {formatDate(booking.checkOut)}
                </div>
                <p className="text-xs text-gray-400 mt-1">By 11:00 AM</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Guests</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Users className="w-4 h-4 text-gold-500" />
                  {booking.adults} Adults, {booking.children} Children
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Clock className="w-4 h-4 text-gold-500" />
                  {booking.nights} Night{booking.nights > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Information</h2>
            <div className="flex gap-4">
              {booking.room?.images?.[0] && (
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={booking.room.images[0].url} alt={booking.room.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{booking.room?.name || "Room"}</h3>
                <p className="text-sm text-gray-500 mt-1">{booking.room?.roomType.replace("_", " ")}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Floor {booking.room?.floor}, Room {booking.room?.roomNumber}
                </p>
              </div>
            </div>
          </div>
          
          {(booking.guestName || booking.specialRequests) && (
            <div className="luxury-card p-6">
              <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h2>
              {booking.guestName && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Primary Guest</p>
                  <p className="text-gray-900 dark:text-white">{booking.guestName}</p>
                  <p className="text-sm text-gray-500">{booking.guestEmail} · {booking.guestPhone}</p>
                </div>
              )}
              {booking.specialRequests && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Special Requests</p>
                  <p className="text-gray-900 dark:text-white text-sm bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Payment & Summary */}
        <div className="space-y-6">
          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Room Charges</span>
                <span>{formatCurrency(booking.roomPrice)}</span>
              </div>
              {booking.extraBedPrice > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Extra Bed ({booking.extraBeds})</span>
                  <span>{formatCurrency(booking.extraBedPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Taxes & Fees</span>
                <span>{formatCurrency(booking.taxAmount)}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(booking.discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>

            {booking.paymentStatus === "PENDING" && booking.status !== "CANCELLED" && (
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full btn-gold py-3 mt-6 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay Now</>
                )}
              </button>
            )}
            
            {booking.paymentStatus === "PAID" && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">Payment Complete</p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Your booking is fully paid.</p>
                </div>
              </div>
            )}
          </div>
          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Check-in QR Code</h2>
            <div 
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                if (booking.qrCode) {
                   const modal = document.createElement('div');
                   modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4';
                   modal.onclick = () => document.body.removeChild(modal);
                   
                   const img = document.createElement('img');
                   img.src = booking.qrCode;
                   img.className = 'w-full max-w-md bg-white p-4 rounded-2xl';
                   
                   modal.appendChild(img);
                   document.body.appendChild(modal);
                }
              }}
            >
              {booking.qrCode ? (
                <>
                  <img src={booking.qrCode} alt="Check-in QR" className="w-48 h-48" />
                  <p className="text-xs text-gold-500 font-medium mt-2">Click to enlarge</p>
                </>
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-400">QR Unavailable</div>
              )}
              <p className="text-xs text-gray-500 mt-4 text-center">Show this QR code at the reception for a quick check-in.</p>
            </div>
          </div>
          
          <button 
            disabled={!booking.invoice}
            onClick={() => {
              if (booking.invoice) {
                router.push(`/dashboard/invoices/${booking.id}`);
              }
            }}
            className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-between hover:border-gold-500 hover:text-gold-500 transition-colors group disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
                  {booking.invoice ? "View Invoice" : "Invoice Pending"}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.invoice?.invoiceNumber || "Will be generated soon"}
                </p>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  )
}
