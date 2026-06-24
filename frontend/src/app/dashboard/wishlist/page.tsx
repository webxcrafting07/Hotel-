"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ArrowRight, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

export default function WishlistPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/users/wishlist")
      return res.data.data
    },
  })

  const removeMutation = useMutation({
    mutationFn: (roomId: string) => api.post(`/users/wishlist/${roomId}`),
    onSuccess: () => { toast.success("Removed from wishlist"); qc.invalidateQueries({ queryKey: ["wishlist"] }) },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data?.length || 0} saved rooms</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="luxury-card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-5 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.length ? (
        <div className="luxury-card p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No saved rooms yet</p>
          <Link href="/rooms" className="btn-gold text-sm">Explore Rooms</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(({ room }: any, i: number) => {
            const img = room.images?.find((im: any) => im.isPrimary) || room.images?.[0]
            return (
              <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }}
                className="luxury-card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image src={img?.url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"} alt={room.name}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={() => removeMutation.mutate(room.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-gold-500 uppercase tracking-wider">{room.roomType.replace("_"," ")}</span>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mt-1 mb-3">{room.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">{formatCurrency(room.pricePerNight)}</span>
                      <span className="text-gray-400 text-xs">/night</span>
                    </div>
                    <Link href={`/rooms/${room.id}`} className="flex items-center gap-1 text-gold-500 text-sm font-medium hover:gap-2 transition-all group">
                      Book <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
