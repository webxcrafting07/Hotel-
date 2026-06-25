"use client"
import { useState, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Star, Users, BedDouble, ArrowRight, Calendar, Minus, Plus, Wifi, Wind, Tv } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import api from "@/lib/api"
import { Room } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { useBookingStore } from "@/store/booking.store"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const roomTypes = ["ALL", "STANDARD", "DELUXE", "SUPERIOR", "JUNIOR_SUITE", "SUITE", "PRESIDENTIAL_SUITE"]

function RoomsContent() {
  const searchParams = useSearchParams()
  const { checkIn, checkOut, adults, children, setCheckIn, setCheckOut, setAdults, setChildren } = useBookingStore()

  const [selectedType, setSelectedType] = useState("ALL")
  const [sortBy, setSortBy] = useState("pricePerNight")
  const [order, setOrder] = useState("asc")
  const [search, setSearch] = useState("")
  const [showGuests, setShowGuests] = useState(false)

  // Use local state if we want to override the store, but store is fine
  // Wait, if searchParams has checkIn, update store? No, store persists. But let's respect searchParams on mount.
  // We'll just pass checkIn/checkOut from store to the API

  const { data, isLoading } = useQuery({
    queryKey: ["rooms", selectedType, sortBy, order, search, checkIn, checkOut, adults, children],
    queryFn: async () => {
      const params: Record<string, string> = { sortBy, order, limit: "50" }
      if (selectedType !== "ALL") params.roomType = selectedType
      if (checkIn) params.checkIn = format(checkIn, "yyyy-MM-dd")
      if (checkOut) params.checkOut = format(checkOut, "yyyy-MM-dd")
      params.adults = adults.toString()
      const res = await api.get("/rooms", { params })
      return res.data.data as Room[]
    },
  })

  const filtered = data?.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/welcome/bed.png')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 w-full">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Luxury Accommodations
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Find Your Sanctuary
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-24 h-1 bg-gold-500 mx-auto mb-6"
          />
        </div>
      </section>

      {/* Advanced Filter Bar (Overlapping Hero) */}
      <div className="relative z-30 max-w-6xl mx-auto -mt-16 px-4 mb-12">
        <div className="bg-white dark:bg-luxury-darker rounded-2xl p-4 shadow-2xl shadow-black/10 border border-gray-100 dark:border-white/5 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto flex-1">
            {/* Check-in */}
            <div className="relative bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 px-4 py-2 hover:border-gold-500/50 transition-colors">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gold-500" />
                <input
                  type="date"
                  value={checkIn ? format(checkIn, "yyyy-MM-dd") : ""}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                  className="bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="relative bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 px-4 py-2 hover:border-gold-500/50 transition-colors">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-out</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gold-500" />
                <input
                  type="date"
                  value={checkOut ? format(checkOut, "yyyy-MM-dd") : ""}
                  min={checkIn ? format(checkIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                  className="bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="relative">
              <div 
                className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 px-4 py-2 cursor-pointer hover:border-gold-500/50 transition-colors h-full"
                onClick={() => setShowGuests(!showGuests)}
              >
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Guests</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child` : ""}
                  </span>
                </div>
              </div>

              {showGuests && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full min-w-[250px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gold-500/30 rounded-xl p-4 shadow-xl z-50">
                  {[
                    { label: "Adults", value: adults, min: 1, max: 10, onChange: setAdults },
                    { label: "Children", value: children, min: 0, max: 6, onChange: setChildren },
                  ].map(({ label, value, min, max, onChange }) => (
                    <div key={label} className="flex items-center justify-between mb-4 last:mb-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gold-500/50 flex items-center justify-center text-gray-500 dark:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500 hover:text-gold-600 dark:hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-gray-900 dark:text-white w-4 text-center text-sm font-semibold">{value}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gold-500/50 flex items-center justify-center text-gray-500 dark:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500 hover:text-gold-600 dark:hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-gray-200 dark:bg-white/10 hidden lg:block mx-4" />

          <div className="flex w-full lg:w-auto items-center gap-3">
             <div className="relative w-full lg:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-gold-500 text-gray-900 dark:text-white"
                />
              </div>
          </div>
        </div>
      </div>

      <div className="container-custom pb-8 px-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide flex-nowrap mb-8">
          {roomTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all duration-300 ${
                selectedType === type
                  ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105"
                  : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gold-500/50 hover:text-gold-500"
              }`}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-luxury-darker rounded-3xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-72 bg-gray-200 dark:bg-gray-800" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white dark:bg-luxury-darker rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Carousel */}
                <div className="relative h-72 overflow-hidden">
                   {room.images && room.images.length > 0 ? (
                      <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        pagination={{ clickable: true }}
                        className="w-full h-full room-carousel"
                      >
                        {room.images.map((img) => (
                          <SwiperSlide key={img.id}>
                            <img src={img.url} alt={room.name} className="w-full h-full object-cover" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                   ) : (
                      <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" alt={room.name} className="w-full h-full object-cover" />
                   )}
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {room.roomType.replace("_", " ")}
                    </span>
                    {room.basePrice && room.basePrice > room.pricePerNight && (
                      <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm w-fit">
                        {Math.round(((room.basePrice - room.pricePerNight) / room.basePrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {room.status !== "AVAILABLE" && (
                    <div className="absolute top-4 right-4 z-10 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {room.status}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
                      {room.name}
                    </h3>
                    {(room.avgRating ?? 0) > 0 && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        {room.avgRating?.toFixed(1)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Highlight Amenities */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-2">
                       {room.hasWifi && <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center" title="Free WiFi"><Wifi className="w-4 h-4 text-blue-500" /></div>}
                       {room.hasAC && <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center" title="Air Conditioning"><Wind className="w-4 h-4 text-cyan-500" /></div>}
                       {room.hasTV && <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center" title="Smart TV"><Tv className="w-4 h-4 text-purple-500" /></div>}
                    </div>
                    <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10" />
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gold-500" />{room.maxAdults} Guests</span>
                      <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-gold-500" />{room.bedType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                          {formatCurrency(room.pricePerNight)}
                        </span>
                        {room.basePrice && room.basePrice > room.pricePerNight && (
                          <span className="text-sm text-gray-400 line-through">{formatCurrency(room.basePrice)}</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Per Night</span>
                    </div>
                    
                    <Link
                      href={`/rooms/${room.id}`}
                      className="group/btn relative overflow-hidden bg-gold-500 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-all hover:bg-gold-600 shadow-lg shadow-gold-500/20"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-luxury-darker rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">No Rooms Available</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any rooms matching your selected dates and criteria. Please try adjusting your search.</p>
            <button onClick={() => { setSelectedType("ALL"); setSearch(""); setCheckIn(null); setCheckOut(null); }} className="btn-gold py-3 px-8">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    }>
      <RoomsContent />
    </Suspense>
  )
}
