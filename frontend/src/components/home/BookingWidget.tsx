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
      <div className="glass-dark rounded-2xl p-6 shadow-luxury border border-gold-500/20">
        <p className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-5 text-center">
          — Reserve Your Stay —
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Check-in */}
          <div className="group">
            <label className="block text-xs font-medium text-gold-400 uppercase tracking-wider mb-2">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
              <input
                type="date"
                value={checkIn ? format(checkIn, "yyyy-MM-dd") : ""}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs font-medium text-gold-400 uppercase tracking-wider mb-2">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
              <input
                type="date"
                value={checkOut ? format(checkOut, "yyyy-MM-dd") : ""}
                min={checkIn ? format(checkIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="relative">
            <label className="block text-xs font-medium text-gold-400 uppercase tracking-wider mb-2">
              Guests
            </label>
            <button
              onClick={() => setShowGuests(!showGuests)}
              className="w-full flex items-center gap-2 pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500 transition-colors text-left"
            >
              <Users className="absolute left-3 w-4 h-4 text-gold-500" />
              {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}
            </button>

            {showGuests && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gold-500/30 rounded-xl p-4 z-50 shadow-xl">
                {[
                  { label: "Adults", value: adults, min: 1, max: 10, onChange: setAdults },
                  { label: "Children", value: children, min: 0, max: 6, onChange: setChildren },
                ].map(({ label, value, min, max, onChange }) => (
                  <div key={label} className="flex items-center justify-between mb-3 last:mb-0">
                    <span className="text-sm text-white">{label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onChange(Math.max(min, value - 1))}
                        className="w-7 h-7 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white w-5 text-center text-sm">{value}</span>
                      <button
                        onClick={() => onChange(Math.min(max, value + 1))}
                        className="w-7 h-7 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-white transition-colors"
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
            <button onClick={handleSearch} className="btn-gold w-full justify-center py-3">
              <Search className="w-4 h-4" />
              Search Rooms
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
