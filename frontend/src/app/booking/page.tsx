"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, Users, ArrowRight, Shield, CheckCircle, CreditCard, AlertCircle, Plus, X, BedDouble, Trash2 } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth.store"
import { Room } from "@/types"
import { formatCurrency, calculateNights } from "@/lib/utils"
import { format } from "date-fns"
import toast from "react-hot-toast"

const schema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(10, "Valid phone number is required"),
  specialRequests: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface SelectedRoom {
  room: Room
  adults: number
  children: number
}

function BookingCheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()

  const roomId = searchParams.get("roomId")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const adultsParam = Number(searchParams.get("adults")) || 1
  const childrenParam = Number(searchParams.get("children")) || 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [additionalRooms, setAdditionalRooms] = useState<SelectedRoom[]>([])
  const [showAddRoom, setShowAddRoom] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      const currentUrl = `/booking?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adultsParam}&children=${childrenParam}`
      toast.error("Please sign in to complete your booking")
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    }
  }, [isMounted, isAuthenticated, router, roomId, checkIn, checkOut, adultsParam, childrenParam])

  const { data: room, isLoading: isRoomLoading } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      if (!roomId) return null
      const res = await api.get(`/rooms/${roomId}`)
      return res.data.data as Room
    },
    enabled: !!roomId && isMounted,
  })

  // Check Availability
  const { data: availabilityData, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ["room-availability", roomId, checkIn, checkOut],
    queryFn: async () => {
      if (!roomId || !checkIn || !checkOut) return null
      const res = await api.get(`/rooms/check-availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`)
      return res.data.data
    },
    enabled: !!roomId && !!checkIn && !!checkOut && isMounted,
  })

  const isAvailable = availabilityData?.available

  // Fetch alternatives if not available
  const { data: alternativeRooms, isLoading: isAltRoomsLoading } = useQuery({
    queryKey: ["alternative-rooms", checkIn, checkOut, adultsParam, childrenParam],
    queryFn: async () => {
      if (isAvailable !== false || !checkIn || !checkOut) return null
      const res = await api.get(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adultsParam}&children=${childrenParam}&limit=3`)
      return res.data.data as Room[]
    },
    enabled: isAvailable === false && isMounted,
  })

  // Fetch available rooms for "Add More Room" panel
  const { data: availableRoomsForAdd } = useQuery({
    queryKey: ["available-rooms-for-add", checkIn, checkOut],
    queryFn: async () => {
      if (!checkIn || !checkOut) return []
      const res = await api.get(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&limit=20&status=AVAILABLE`)
      return res.data.data as Room[]
    },
    enabled: showAddRoom && !!checkIn && !!checkOut && isMounted,
  })

  // Filter out already selected rooms
  const allSelectedIds = [roomId, ...additionalRooms.map((r) => r.room.id)]
  const filteredAvailableRooms = availableRoomsForAdd?.filter((r) => !allSelectedIds.includes(r.id)) || []

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: user ? `${user.firstName} ${user.lastName}` : "",
      guestEmail: user?.email || "",
      guestPhone: user?.phone || "",
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!roomId || !checkIn || !checkOut) return
    setIsSubmitting(true)

    try {
      // Book primary room
      await api.post("/bookings", {
        roomId,
        checkIn,
        checkOut,
        adults: adultsParam,
        children: childrenParam,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests,
      })

      // Book additional rooms
      for (const addRoom of additionalRooms) {
        await api.post("/bookings", {
          roomId: addRoom.room.id,
          checkIn,
          checkOut,
          adults: addRoom.adults,
          children: addRoom.children,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialRequests: data.specialRequests,
        })
      }

      const totalRooms = 1 + additionalRooms.length
      toast.success(`${totalRooms} room${totalRooms > 1 ? "s" : ""} booked successfully!`)
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRoom = (r: Room) => {
    setAdditionalRooms([...additionalRooms, { room: r, adults: 1, children: 0 }])
    toast.success(`${r.name} added!`)
  }

  const removeRoom = (index: number) => {
    setAdditionalRooms(additionalRooms.filter((_, i) => i !== index))
  }

  if (!isMounted || !isAuthenticated || isRoomLoading || isAvailabilityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!room || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-serif mb-4">Invalid Booking Details</h2>
          <button onClick={() => router.push("/rooms")} className="btn-gold">Back to Rooms</button>
        </div>
      </div>
    )
  }

  const parsedCheckIn = new Date(checkIn)
  const parsedCheckOut = new Date(checkOut)
  const nights = calculateNights(parsedCheckIn, parsedCheckOut)

  // Price calculations
  const primaryRoomPrice = room.pricePerNight * nights
  const additionalRoomsPrice = additionalRooms.reduce((sum, r) => sum + r.room.pricePerNight * nights, 0)
  const subtotal = primaryRoomPrice + additionalRoomsPrice
  const gst = subtotal * 0.18
  const totalPrice = subtotal + gst
  const totalRoomCount = 1 + additionalRooms.length

  if (isAvailable === false) {
    return (
      <div className="pt-24 pb-16 bg-gray-50 dark:bg-luxury-darker min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Room Unavailable</h1>
            <p className="text-gray-500 max-w-lg mx-auto">Sorry, the <span className="font-semibold text-gray-900 dark:text-white">{room.name}</span> is no longer available for your selected dates.</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gold-500" />
              {format(parsedCheckIn, "MMM dd, yyyy")} - {format(parsedCheckOut, "MMM dd, yyyy")}
            </div>
          </div>

          {isAltRoomsLoading ? (
             <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" /></div>
          ) : alternativeRooms && alternativeRooms.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-gray-900 dark:text-white">Available Alternatives</h2>
                <button onClick={() => router.push("/rooms")} className="text-gold-500 text-sm hover:underline">View all rooms</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {alternativeRooms.map((altRoom) => (
                  <div key={altRoom.id} className="luxury-card overflow-hidden flex flex-col group border border-gray-100 dark:border-white/5 hover:border-gold-500/50 transition-colors">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {altRoom.images?.[0] ? (
                        <img src={altRoom.images[0].url} alt={altRoom.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80" alt="Room" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-gray-900 dark:text-white">
                        Available
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-1">{altRoom.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex-1">{altRoom.roomType.replace("_", " ")}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(altRoom.pricePerNight)}<span className="text-xs text-gray-500 font-normal">/night</span></p>
                        <button
                          onClick={() => router.push(`/booking?roomId=${altRoom.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adultsParam}&children=${childrenParam}`)}
                          className="px-4 py-2 bg-gold-500 text-white text-sm rounded-lg hover:bg-gold-600 transition-colors shadow-gold"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center bg-white dark:bg-luxury-card p-8 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-gray-500 mb-6">We couldn't find any other rooms available for these exact dates that fit your party size.</p>
              <button onClick={() => router.push("/rooms")} className="btn-gold">Change Dates or Guests</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-luxury-darker min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
          <p className="text-gray-500">Please review your booking details and provide your information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-luxury-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-white/10 text-gray-900 dark:text-white">
                Guest Details
              </h2>
              <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      {...register("guestName")}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent focus:border-gold-500 outline-none text-gray-900 dark:text-white"
                      placeholder="John Doe"
                    />
                    {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      {...register("guestEmail")}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent focus:border-gold-500 outline-none text-gray-900 dark:text-white"
                      placeholder="john@example.com"
                    />
                    {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input
                    {...register("guestPhone")}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent focus:border-gold-500 outline-none text-gray-900 dark:text-white"
                    placeholder="+91 9876543210"
                  />
                  {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Requests (Optional)</label>
                  <textarea
                    {...register("specialRequests")}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent focus:border-gold-500 outline-none text-gray-900 dark:text-white resize-none"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </form>
            </div>

            {/* Add More Rooms Section */}
            <div className="bg-white dark:bg-luxury-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
                <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-gold-500" />
                  Your Rooms ({totalRoomCount})
                </h2>
                <button
                  onClick={() => setShowAddRoom(!showAddRoom)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-xl text-sm font-medium hover:bg-gold-100 dark:hover:bg-gold-500/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add More Room
                </button>
              </div>

              {/* Primary Room */}
              <div className="flex items-center gap-4 p-4 bg-gold-50/50 dark:bg-gold-500/5 rounded-xl border border-gold-200/50 dark:border-gold-500/10 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">{room.name}</h4>
                  <p className="text-xs text-gray-500">Room #{room.roomNumber} · {room.roomType.replace(/_/g, " ")} · {adultsParam}A, {childrenParam}C</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(primaryRoomPrice)}</p>
                  <p className="text-xs text-gray-500">{nights} night{nights > 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Additional Rooms */}
              {additionalRooms.map((item, index) => (
                <div key={item.room.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 mb-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.room.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"}
                      alt={item.room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.room.name}</h4>
                    <p className="text-xs text-gray-500">Room #{item.room.roomNumber} · {item.room.roomType.replace(/_/g, " ")}</p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.room.pricePerNight * nights)}</p>
                      <p className="text-xs text-gray-500">{nights} night{nights > 1 ? "s" : ""}</p>
                    </div>
                    <button
                      onClick={() => removeRoom(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More Room Panel */}
              {showAddRoom && (
                <div className="mt-6 border-t border-gray-100 dark:border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Available Rooms for {format(parsedCheckIn, "MMM dd")} – {format(parsedCheckOut, "MMM dd")}
                    </h3>
                    <button onClick={() => setShowAddRoom(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {filteredAvailableRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {filteredAvailableRooms.map((avRoom) => (
                        <div key={avRoom.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-white/10 rounded-xl hover:border-gold-500/40 transition-colors group">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img
                              src={avRoom.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"}
                              alt={avRoom.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{avRoom.name}</h4>
                            <p className="text-xs text-gray-500">#{avRoom.roomNumber} · {formatCurrency(avRoom.pricePerNight)}/night</p>
                          </div>
                          <button
                            onClick={() => addRoom(avRoom)}
                            className="shrink-0 p-2 bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-lg hover:bg-gold-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-6">No more rooms available for these dates.</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-luxury-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-8">
               <h2 className="font-serif text-xl font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-white/10 text-gray-900 dark:text-white flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-gold-500" />
                 Payment Method
               </h2>
               <div className="p-4 border border-gold-500/30 rounded-xl bg-gold-50 dark:bg-gold-500/5 text-sm text-gray-700 dark:text-gray-300">
                 <p className="font-medium mb-1">Pay at Hotel</p>
                 <p className="text-xs opacity-80">Your booking will be confirmed immediately. Payment will be collected during check-in or check-out.</p>
               </div>
            </div>

          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-luxury-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-white/10">
                <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Summary · {totalRoomCount} Room{totalRoomCount > 1 ? "s" : ""}
                </h3>

                {/* Primary room */}
                <div className="flex gap-4 mb-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{room.name}</h4>
                    <p className="text-xs text-gray-500">{room.roomType.replace(/_/g, " ")}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                       <CheckCircle className="w-3 h-3 text-green-500" /> Free Cancellation
                    </div>
                  </div>
                </div>

                {/* Additional rooms in summary */}
                {additionalRooms.map((item) => (
                  <div key={item.room.id} className="flex gap-4 py-3 border-t border-gray-100 dark:border-white/10">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.room.images?.[0]?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80"}
                        alt={item.room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.room.name}</h4>
                      <p className="text-xs text-gray-500">#{item.room.roomNumber} · {formatCurrency(item.room.pricePerNight)}/night</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 space-y-4 text-sm border-b border-gray-100 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold-500 shrink-0" />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <p className="text-gray-500">Check-in</p>
                      <p className="font-medium text-gray-900 dark:text-white">{format(parsedCheckIn, "MMM dd, yyyy")}</p>
                      <p className="text-xs text-gray-500">From 2:00 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-medium text-gray-900 dark:text-white">{format(parsedCheckOut, "MMM dd, yyyy")}</p>
                      <p className="text-xs text-gray-500">Until 11:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {totalRoomCount} Room{totalRoomCount > 1 ? "s" : ""} · {nights} Night{nights > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {adultsParam} Adult{adultsParam > 1 ? "s" : ""}, {childrenParam} Child{childrenParam !== 1 ? "ren" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3 bg-gray-50 dark:bg-white/5">
                {/* Primary room */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {room.name} × {nights}n
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(primaryRoomPrice)}</span>
                </div>

                {/* Additional rooms */}
                {additionalRooms.map((item) => (
                  <div key={item.room.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.room.name} × {nights}n
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.room.pricePerNight * nights)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Taxes & fees (18% GST)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(gst)}</span>
                </div>
                
                <div className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total Amount</span>
                    <span className="text-xl font-bold text-gold-600 dark:text-gold-400">{formatCurrency(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-right text-gray-500">Includes taxes and fees</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-white/10">
                <button
                  type="submit"
                  form="booking-form"
                  disabled={isSubmitting}
                  className="btn-gold w-full justify-center py-4 text-base shadow-gold hover:shadow-gold-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>Confirm {totalRoomCount} Room{totalRoomCount > 1 ? "s" : ""} <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  SSL Secured Checkout
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingCheckoutPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      }>
        <BookingCheckoutContent />
      </Suspense>
    </MainLayout>
  )
}
