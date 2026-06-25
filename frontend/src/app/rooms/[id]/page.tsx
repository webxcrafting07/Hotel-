"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Star, Users, BedDouble, Bath, Wifi, Wind, Tv, Coffee,
  CheckCircle, ChevronLeft, ChevronRight, Heart, Share2,
  Calendar, ArrowRight, Shield, AlertCircle
} from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import api from "@/lib/api"
import { Room } from "@/types"
import { formatCurrency, calculateNights } from "@/lib/utils"
import { format } from "date-fns"
import { useBookingStore } from "@/store/booking.store"
import toast from "react-hot-toast"

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [activeImg, setActiveImg] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const { checkIn, checkOut, adults, children, setCheckIn, setCheckOut, setAdults, setChildren } = useBookingStore()

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const res = await api.get(`/rooms/${id}`)
      return res.data.data as Room
    },
  })

  const { data: availability } = useQuery({
    queryKey: ["availability", id, checkIn, checkOut],
    queryFn: async () => {
      if (!checkIn || !checkOut) return { available: true };
      const checkInFormatted = format(new Date(checkIn), "yyyy-MM-dd");
      const checkOutFormatted = format(new Date(checkOut), "yyyy-MM-dd");
      const res = await api.get(`/rooms/check-availability?roomId=${id}&checkIn=${checkInFormatted}&checkOut=${checkOutFormatted}`);
      return res.data.data as { available: boolean };
    },
    enabled: !!checkIn && !!checkOut,
  })

  const isAvailable = availability?.available ?? true;

  const parsedCheckIn = checkIn ? new Date(checkIn) : null
  const parsedCheckOut = checkOut ? new Date(checkOut) : null

  const nights = parsedCheckIn && parsedCheckOut ? calculateNights(parsedCheckIn, parsedCheckOut) : 1
  const totalPrice = room ? room.pricePerNight * nights : 0

  const handleBook = () => {
    if (!parsedCheckIn || !parsedCheckOut) {
      toast.error("Please select check-in and check-out dates")
      return
    }
    if (!isAvailable) {
      toast.error("Room is not available for selected dates")
      return
    }
    router.push(`/booking?roomId=${id}&checkIn=${format(parsedCheckIn, "yyyy-MM-dd")}&checkOut=${format(parsedCheckOut, "yyyy-MM-dd")}&adults=${adults}&children=${children}`)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    )
  }

  if (!room) return null

  const images = room.images?.length > 0
    ? room.images
    : [{ url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", alt: room.name, id: "1", isPrimary: true }]

  return (
    <MainLayout>
      <div className="pt-28 pb-16 bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom px-4 md:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {room.roomType.replace("_", " ")}
                </span>
                {room.avgRating && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    {room.avgRating.toFixed(1)} <span className="text-gray-400 font-normal">({room.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {room.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gold-500 hover:text-gold-500 transition-colors text-gray-600 dark:text-gray-300 font-medium text-sm bg-white dark:bg-white/5 shadow-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-500 hover:text-red-500 transition-colors text-gray-600 dark:text-gray-300 font-medium text-sm bg-white dark:bg-white/5 shadow-sm">
                <Heart className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* Modern Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] md:h-[60vh] mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 relative">
            {images.length >= 3 ? (
              <>
                <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => { setActiveImg(0); setShowGallery(true); }}>
                  <img src={images[0].url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="md:col-span-2 h-full relative group cursor-pointer" onClick={() => { setActiveImg(1); setShowGallery(true); }}>
                  <img src={images[1].url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="md:col-span-1 h-full relative group cursor-pointer hidden md:block" onClick={() => { setActiveImg(2); setShowGallery(true); }}>
                  <img src={images[2].url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="md:col-span-1 h-full relative group cursor-pointer hidden md:block" onClick={() => { setActiveImg(images[3] ? 3 : 0); setShowGallery(true); }}>
                  <img src={images[3]?.url || images[0].url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-semibold text-lg drop-shadow-md">View All Photos</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="md:col-span-4 relative group cursor-pointer" onClick={() => setShowGallery(true)}>
                <img src={images[0].url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )}
            
            {room.basePrice && room.basePrice > room.pricePerNight && (
              <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg z-10 border border-white/20">
                {Math.round(((room.basePrice - room.pricePerNight) / room.basePrice) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Room Info */}
            <div className="lg:col-span-2">

              {room.avgRating && (
                <div className="flex items-center gap-2 mb-6">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(room.avgRating!) ? "fill-gold-400 text-gold-400" : "text-gray-300"}`} />
                  ))}
                  <span className="text-gold-500 font-medium">{room.avgRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({room.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100 dark:border-white/5 mb-6">
                {[
                  { icon: Users, label: `${room.maxAdults} Adults, ${room.maxChildren} Children` },
                  { icon: BedDouble, label: `${room.bedType.replace("_", " ")} Bed` },
                  { icon: Bath, label: `${room.bathrooms} Bathroom${room.bathrooms > 1 ? "s" : ""}` },
                  ...(room.size ? [{ icon: Shield, label: `${room.size} m²` }] : []),
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Icon className="w-4 h-4 text-gold-500" />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-3">About This Room</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{room.description}</p>
              </div>

              {/* Amenities */}
              {room.amenities?.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-4">Room Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map(({ amenity }) => (
                      <div key={amenity.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500 shrink-0" />
                        {amenity.name}
                      </div>
                    ))}
                    {room.hasWifi && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500" />Free WiFi
                      </div>
                    )}
                    {room.hasAC && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500" />Air Conditioning
                      </div>
                    )}
                    {room.hasTV && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500" />Smart TV
                      </div>
                    )}
                    {room.hasBreakfast && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500" />Breakfast Included
                      </div>
                    )}
                    {room.hasBalcony && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gold-500" />Private Balcony
                      </div>
                    )}
                  </div>
                </div>
              )}

              {room.cancelPolicy && (
                <div className="bg-gold-50 dark:bg-gold-500/5 border border-gold-200 dark:border-gold-500/20 rounded-xl p-5 mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold-500" />
                    Cancellation Policy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.cancelPolicy}</p>
                </div>
              )}

              {/* Reviews */}
              {room.reviews && room.reviews.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-6">Guest Reviews</h2>
                  <div className="space-y-6">
                    {room.reviews.slice(0, 3).map((review: any) => (
                      <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center">
                            <span className="text-gold-600 font-semibold text-sm">
                              {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array(review.rating).fill(0).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                        {review.adminReply && (
                          <div className="mt-3 pl-4 border-l-2 border-gold-500">
                            <p className="text-xs text-gold-500 font-medium mb-1">Hotel Response</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="luxury-card p-6">
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {room.basePrice && room.basePrice > room.pricePerNight && (
                        <span className="text-lg text-gray-400 line-through">{formatCurrency(room.basePrice)}</span>
                      )}
                      <span className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                        {formatCurrency(room.pricePerNight)}
                      </span>
                      <span className="text-gray-500 text-sm"> /night</span>
                    </div>
                    {room.basePrice && room.basePrice > room.pricePerNight && (
                      <span className="inline-block mt-1.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        Save {Math.round(((room.basePrice - room.pricePerNight) / room.basePrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-medium text-gold-500 uppercase tracking-wider mb-1.5">Check-in</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={parsedCheckIn ? format(parsedCheckIn, "yyyy-MM-dd") : ""}
                          min={format(new Date(), "yyyy-MM-dd")}
                          onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gold-500 uppercase tracking-wider mb-1.5">Check-out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={parsedCheckOut ? format(parsedCheckOut, "yyyy-MM-dd") : ""}
                          min={parsedCheckIn ? format(parsedCheckIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                          onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gold-500 uppercase tracking-wider mb-1.5">Adults</label>
                        <select
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full px-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-gold-500"
                        >
                          {Array.from({ length: room.maxAdults }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gold-500 uppercase tracking-wider mb-1.5">Children</label>
                        <select
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full px-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-gold-500"
                        >
                          {Array.from({ length: room.maxChildren + 1 }, (_, i) => i).map((n) => (
                            <option key={n} value={n}>{n === 0 ? "No children" : `${n} Child${n > 1 ? "ren" : ""}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {parsedCheckIn && parsedCheckOut && (
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-5 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{formatCurrency(room.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Taxes & fees (18% GST)</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totalPrice * 0.18)}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-white/10 pt-2 flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gold-600 dark:text-gold-400">{formatCurrency(totalPrice * 1.18)}</span>
                      </div>
                    </div>
                  )}

                  {parsedCheckIn && parsedCheckOut && !isAvailable && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        This room is already booked for these dates. Please select different dates.
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={handleBook} 
                    disabled={!isAvailable || !parsedCheckIn || !parsedCheckOut}
                    className={`w-full justify-center py-3.5 text-base flex items-center gap-2 rounded-xl font-medium transition-all ${
                      isAvailable && parsedCheckIn && parsedCheckOut 
                        ? "bg-gold-500 hover:bg-gold-600 text-white shadow-gold" 
                        : "bg-gray-200 dark:bg-white/5 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isAvailable ? "Reserve Now" : "Unavailable"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    Free cancellation · Best price guaranteed
                  </p>
                </div>

                <div className="luxury-card p-5 mt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Pricing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekday</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(room.pricePerNight)}/night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekend</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(room.weekendPrice)}/night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Festival</span>
                      <span className="font-medium text-gold-600 dark:text-gold-400">{formatCurrency(room.festivalPrice)}/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <AlertCircle className="w-6 h-6 hidden" />
            <span className="text-xl font-bold leading-none px-1">×</span>
          </button>
          
          <div className="relative w-full max-w-6xl h-[80vh] px-4 md:px-12 flex items-center justify-center">
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1)) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center text-white transition-colors z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            <div className="relative w-full h-full flex items-center justify-center">
              {images[activeImg]?.isVideo ? (
                <video src={images[activeImg]?.url} className="max-w-full max-h-full object-contain rounded-lg" controls autoPlay />
              ) : (
                <img src={images[activeImg]?.url} alt={room.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              )}
            </div>
            
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1)) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center text-white transition-colors z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {/* Thumbnails in modal */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImg ? "border-gold-500 opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </MainLayout>
  )
}
