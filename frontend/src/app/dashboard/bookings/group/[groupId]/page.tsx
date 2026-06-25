"use client"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Clock, FileText, CheckCircle, QrCode } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth.store"

export default function GroupBookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const groupId = params.groupId as string
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: group, isLoading, isError } = useQuery({
    queryKey: ["group-booking", groupId],
    queryFn: async () => {
      const res = await api.get(`/bookings/group/${groupId}`)
      return res.data.data
    },
    staleTime: 0,
    refetchOnMount: true
  })

  const handlePayment = async () => {
    if (!group) return
    setIsProcessing(true)
    
    try {
      const orderRes = await api.post("/payments/razorpay/order", {
        groupId: group.groupId,
        amount: group.totalAmount - group.paidAmount,
      })
      
      const { orderId, amount, currency, keyId } = orderRes.data.data

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Hotel The Anand",
        description: `Payment for Group Booking`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              groupId: group.groupId,
            })
            
            toast.success("Payment successful!")
            queryClient.invalidateQueries({ queryKey: ["group-booking", groupId] })
          } catch (error) {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: group.guestName || `${user?.firstName} ${user?.lastName}`,
          email: group.guestEmail || user?.email,
          contact: group.guestPhone || user?.phone || "",
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

  if (isError || !group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Group Booking not found</h2>
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
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Group Booking</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{group.roomsCount} Rooms Reserved</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            group.status === "CONFIRMED" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
            group.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
            group.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
            "bg-gray-100 text-gray-700"
          }`}>
            {group.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            group.paymentStatus === "PAID" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
            group.paymentStatus === "PARTIAL" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
            group.paymentStatus === "FAILED" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
            "bg-gray-100 text-gray-700"
          }`}>
            PAYMENT: {group.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Stay Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check In</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  {formatDate(group.checkIn)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check Out</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  {formatDate(group.checkOut)}
                </div>
              </div>
            </div>
          </div>

          <div className="luxury-card p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Reserved Rooms</h2>
            {group.bookings.map((b: any, index: number) => (
              <div key={b.id} className="flex gap-4 p-4 border border-gray-100 dark:border-white/5 rounded-xl">
                {b.room?.images?.[0] && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={b.room.images[0].url} alt={b.room.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">{b.room?.name || "Room"}</h3>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(b.totalAmount)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{b.adults} Adults, {b.children} Children</p>
                  <p className="text-xs text-gray-400 mt-1">Booking #{b.bookingNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="luxury-card p-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total Due</span>
                <span>{formatCurrency(group.totalAmount - group.paidAmount)}</span>
              </div>
            </div>

            {group.paymentStatus !== "PAID" && group.status !== "CANCELLED" && (
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full btn-gold py-3 mt-6 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay {formatCurrency(group.totalAmount - group.paidAmount)}</>
                )}
              </button>
            )}
            
            {group.paymentStatus === "PAID" && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">Payment Complete</p>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Your group booking is fully paid.</p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            disabled={!group.invoice}
            onClick={() => {
              if (group.invoice) {
                router.push(`/dashboard/invoices/${group.bookings[0].id}`);
              }
            }}
            className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-between hover:border-gold-500 hover:text-gold-500 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
                  {group.invoice ? "View Invoice" : "Invoice Pending"}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
