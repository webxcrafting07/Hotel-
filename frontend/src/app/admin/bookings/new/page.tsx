"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export default function NewOfflineBookingPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [idProofFile, setIdProofFile] = useState<File | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestAddress: "",
      roomId: "",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      adults: 1,
      children: 0,
      extraBeds: 0,
      paymentMethod: "CASH",
      idProofType: "AADHAR",
    }
  })

  const paymentMethod = watch("paymentMethod")
  const checkInDate = watch("checkIn")
  const checkOutDate = watch("checkOut")

  const { data: roomsData } = useQuery({
    queryKey: ["admin-rooms-available", checkInDate, checkOutDate],
    queryFn: async () => {
      const res = await api.get(`/rooms?limit=100&checkIn=${checkInDate}&checkOut=${checkOutDate}`)
      return res.data.data
    },
    enabled: !!checkInDate && !!checkOutDate,
  })

  const processRazorpay = async (booking: any) => {
    try {
      const orderRes = await api.post("/payments/razorpay/order", {
        bookingId: booking.id,
        amount: booking.totalAmount,
      })
      
      const { orderId, amount, currency, keyId } = orderRes.data.data

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Hotel The Anand",
        description: `Walk-in Booking #${booking.bookingNumber}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
            })
            toast.success("Online payment successful and booking confirmed!")
            qc.invalidateQueries({ queryKey: ["admin-bookings"] })
            router.push("/admin/bookings")
          } catch (error) {
            toast.error("Payment verification failed")
            router.push("/admin/bookings")
          }
        },
        prefill: {
          name: booking.guestName,
          email: booking.guestEmail,
          contact: booking.guestPhone,
        },
        theme: { color: "#C9A84C" }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`)
        router.push("/admin/bookings")
      })
      rzp.open()
    } catch (error) {
      toast.error("Failed to initiate Razorpay payment.")
      router.push("/admin/bookings")
    }
  }

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post("/bookings/offline", formData, { headers: { "Content-Type": "multipart/form-data" } })
    },
    onSuccess: async (res) => {
      const booking = res.data.data
      if (paymentMethod === "CASH") {
        toast.success("Offline booking confirmed with Cash payment!")
        qc.invalidateQueries({ queryKey: ["admin-bookings"] })
        router.push("/admin/bookings")
      } else {
        await processRazorpay(booking)
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create booking")
      setIsLoading(false)
    }
  })

  const onSubmit = (data: any) => {
    setIsLoading(true)
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    if (idProofFile) formData.append("idProof", idProofFile)
    
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex items-center gap-4">
        <Link href="/admin/bookings" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">New Walk-In Booking</h1>
          <p className="text-sm text-gray-500">Create a booking and collect payment immediately</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="luxury-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guest Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 dark:border-white/10 text-gold-600">Guest Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input {...register("guestName", { required: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input {...register("guestPhone", { required: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" {...register("guestEmail")} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input {...register("guestAddress")} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ID Proof Type</label>
                  <select {...register("idProofType")} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-white/10">
                    <option value="AADHAR">Aadhar Card</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload ID (Scan)</label>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setIdProofFile(e.target.files?.[0] || null)} className="w-full text-sm py-1.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 dark:border-white/10 text-gold-600">Stay Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assign Room</label>
                <select {...register("roomId", { required: true })} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-white/10" required>
                  <option value="">Select an Available Room</option>
                  {roomsData?.map((room: any) => (
                    <option key={room.id} value={room.id}>{room.roomNumber} - {room.name} (₹{room.pricePerNight})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check In Date</label>
                  <input type="date" {...register("checkIn", { required: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check Out Date</label>
                  <input type="date" {...register("checkOut", { required: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Adults</label>
                  <input type="number" min="1" {...register("adults", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Children</label>
                  <input type="number" min="0" {...register("children", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Extra Beds</label>
                  <input type="number" min="0" {...register("extraBeds", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 text-gold-700' : 'dark:border-white/10'}`}>
                    <input type="radio" value="CASH" {...register("paymentMethod")} className="sr-only" />
                    Cash Collection
                  </label>
                  <label className={`border rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 text-gold-700' : 'dark:border-white/10'}`}>
                    <input type="radio" value="RAZORPAY" {...register("paymentMethod")} className="sr-only" />
                    Online (UPI/Card)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t dark:border-white/10">
          <p className="text-sm text-gray-500">
            {paymentMethod === 'RAZORPAY' ? "A Razorpay window will open to collect payment." : "Collect cash from the guest before confirming."}
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-gold-500 text-white font-medium rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <span className="animate-pulse">Processing...</span> : <><Save className="w-5 h-5" /> Confirm Walk-In</>}
          </button>
        </div>
      </form>
    </div>
  )
}
