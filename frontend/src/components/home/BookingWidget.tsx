"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Users, Search, Minus, Plus } from "lucide-react"
import { format } from "date-fns"
import { useBookingStore } from "@/store/booking.store"

export function BookingWidget() {
  const router = useRouter()
  const { checkIn, checkOut, adults, children, setCheckIn, setCheckOut, setAdults, setChildren } = useBookingStore()
  const [showGuests, setShowGuests] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"))
    params.set("adults", adults.toString())
    params.set("children", children.toString())
    router.push(`/rooms?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative z-20 max-w-5xl mx-auto -mt-10 px-4"
    >
      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-white/10 relative overflow-hidden">
        {/* Subtle top gradient line for premium feel */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 opacity-50" />
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            Reserve Your Stay
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Check-in */}
          <div className="group">
            <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
              <input
                type="date"
                value={checkIn ? format(checkIn, "yyyy-MM-dd") : ""}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-2xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
              <input
                type="date"
                value={checkOut ? format(checkOut, "yyyy-MM-dd") : ""}
                min={checkIn ? format(checkIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-2xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
              Guests
            </label>
            <button
              onClick={() => setShowGuests(!showGuests)}
              className="w-full flex items-center gap-2 pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-2xl text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-left"
            >
              <Users className="absolute left-4 w-4 h-4 text-gold-500" />
              {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}
            </button>

            {showGuests && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl p-5 z-50 shadow-2xl">
                {[
                  { label: "Adults", value: adults, min: 1, max: 10, onChange: setAdults },
                  { label: "Children", value: children, min: 0, max: 6, onChange: setChildren },
                ].map(({ label, value, min, max, onChange }) => (
                  <div key={label} className="flex items-center justify-between mb-4 last:mb-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onChange(Math.max(min, value - 1))}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-gray-900 dark:text-white w-4 text-center text-sm font-bold">{value}</span>
                      <button
                        onClick={() => onChange(Math.min(max, value + 1))}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button onClick={handleSearch} className="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-3.5 rounded-2xl transition-all shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 flex justify-center items-center gap-2 transform hover:-translate-y-0.5">
              <Search className="w-4 h-4" />
              Search Rooms
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
