"use client"
import { useState, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Star, Users, BedDouble, Heart, ArrowRight } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout"
import api from "@/lib/api"
import { Room } from "@/types"
import { formatCurrency } from "@/lib/utils"

const roomTypes = ["ALL", "STANDARD", "DELUXE", "SUPERIOR", "JUNIOR_SUITE", "SUITE", "PRESIDENTIAL_SUITE"]

function RoomsContent() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState("ALL")
  const [sortBy, setSortBy] = useState("pricePerNight")
  const [order, setOrder] = useState("asc")
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["rooms", selectedType, sortBy, order, searchParams.toString()],
    queryFn: async () => {
      const params: Record<string, string> = { sortBy, order, limit: "18" }
      if (selectedType !== "ALL") params.roomType = selectedType
      if (searchParams.get("checkIn")) params.checkIn = searchParams.get("checkIn")!
      if (searchParams.get("checkOut")) params.checkOut = searchParams.get("checkOut")!
      if (searchParams.get("adults")) params.adults = searchParams.get("adults")!
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
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1542314831-c53cd4b85ca4?w=1600&q=80" 
          alt="Luxury Rooms" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 w-full">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Our Accommodations
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Rooms & Suites
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-24 h-1 bg-gold-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 max-w-xl mx-auto text-lg"
          >
            Choose from 18 meticulously designed rooms offering unparalleled luxury, comfort, and breathtaking views.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md dark:bg-luxury-dark/90 shadow-luxury border-b border-gold-500/10 transition-colors duration-300">
        <div className="container-custom px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Type filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-nowrap">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? "bg-gold-500 text-white shadow-gold"
                      : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gold-500/10"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split("-")
                  setSortBy(s)
                  setOrder(o)
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-gold-500 text-gray-700 dark:text-gray-200"
              >
                <option value="pricePerNight-asc">Price: Low to High</option>
                <option value="pricePerNight-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="luxury-card overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((room, i) => {
                const img = room.images?.find((im) => im.isPrimary) || room.images?.[0]
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group luxury-card overflow-hidden"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={img?.url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                        alt={room.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-gold-500 text-white text-xs px-3 py-1 rounded-full">
                          {room.roomType.replace("_", " ")}
                        </span>
                        {room.basePrice && room.basePrice > room.pricePerNight && (
                          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                            {Math.round(((room.basePrice - room.pricePerNight) / room.basePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      {room.status !== "AVAILABLE" && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                          {room.status}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
                          {room.name}
                        </h3>
                        {room.avgRating && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                            {room.avgRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {room.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gold-500" />
                          {room.maxAdults}A / {room.maxChildren}C
                        </span>
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-gold-500" />
                          {room.bedType}
                        </span>
                        {room.size && <span>{room.size}m²</span>}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                        <div>
                          <div className="flex items-baseline gap-2">
                            {room.basePrice && room.basePrice > room.pricePerNight && (
                              <span className="text-sm text-gray-400 line-through">{formatCurrency(room.basePrice)}</span>
                            )}
                            <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                              {formatCurrency(room.pricePerNight)}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">/night</span>
                        </div>
                        <Link
                          href={`/rooms/${room.id}`}
                          className="btn-gold text-sm py-2 px-4"
                        >
                          Book Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No rooms found matching your criteria.</p>
              <button onClick={() => { setSelectedType("ALL"); setSearch("") }} className="btn-gold mt-4">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
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
