"use client"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Star, Users, BedDouble, ArrowRight, Heart } from "lucide-react"
import api from "@/lib/api"
import { Room } from "@/types"
import { formatCurrency } from "@/lib/utils"

function RoomCard({ room, index }: { room: Room; index: number }) {
  const img = room.images?.find((im) => im.isPrimary) || room.images?.[0]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
}

export function FeaturedRooms() {
  const { data } = useQuery({
    queryKey: ["featured-rooms"],
    queryFn: async () => {
      const res = await api.get("/rooms")
      // Slice the first 6 rooms to match the exact order of the rooms page
      return (res.data.data as Room[]).slice(0, 6)
    },
  })

  return (
    <section className="section-padding bg-gray-50 dark:bg-luxury-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold-500 text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Our Accommodations
          </p>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            Luxury Rooms & Suites
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Each room is thoughtfully designed to offer the perfect blend of comfort, elegance, and modern amenities.
          </p>
          <div className="flex justify-center mt-4">
            <div className="w-16 h-0.5 bg-gold-500" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data || Array(6).fill(null)).map((room, i) =>
            room ? (
              <RoomCard key={room.id} room={room} index={i} />
            ) : (
              <div key={i} className="luxury-card overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            )
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/rooms" className="btn-gold inline-flex items-center gap-2 py-3 px-8 text-sm font-semibold">
            View All Rooms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
