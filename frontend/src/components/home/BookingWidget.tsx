"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Users, Search, Minus, Plus } from "lucide-react"
import { format } from "date-fns"
import { useBookingStore } from "@/store/booking.store"

export function BookingWidget() {
  const router = useRouter()
  const { checkIn, checkOut, adults, children, setCheckIn, setCheckOut, setAdults, setChildren } = useBookingStore()
  const [showGuests, setShowGuests] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGuests(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

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
      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl md:rounded-full p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-white/10 relative z-30">
        
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/10">
          
          {/* Check-in */}
          <div className="w-full md:flex-1 group relative cursor-pointer px-4 md:px-8 py-3">
            <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 cursor-pointer">
              Check-in
            </label>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gold-500" />
              <input
                type="date"
                value={checkIn ? format(checkIn, "yyyy-MM-dd") : ""}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="w-full md:flex-1 group relative cursor-pointer px-4 md:px-8 py-3">
            <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 cursor-pointer">
              Check-out
            </label>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gold-500" />
              <input
                type="date"
                value={checkOut ? format(checkOut, "yyyy-MM-dd") : ""}
                min={checkIn ? format(checkIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="w-full md:flex-1 relative cursor-pointer px-4 md:px-8 py-3" ref={dropdownRef}>
            <div onClick={() => setShowGuests(!showGuests)} className="w-full">
              <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 cursor-pointer">
                Guests
              </label>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold-500" />
                <span className="text-gray-900 dark:text-white text-sm font-semibold truncate">
                  {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}
                </span>
              </div>
            </div>

            {showGuests && (
              <div className="absolute top-full left-0 md:left-auto md:right-0 mt-4 md:mt-6 w-full md:w-80 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-3xl p-6 z-50 shadow-2xl">
                {[
                  { label: "Adults", value: adults, min: 1, max: 10, onChange: setAdults },
                  { label: "Children", value: children, min: 0, max: 6, onChange: setChildren },
                ].map(({ label, value, min, max, onChange }) => (
                  <div key={label} className="flex items-center justify-between mb-5 last:mb-0">
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onChange(Math.max(min, value - 1))}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-900 dark:text-white w-5 text-center text-base font-bold">{value}</span>
                      <button
                        onClick={() => onChange(Math.min(max, value + 1))}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto p-2">
            <button 
              onClick={handleSearch} 
              className="w-full md:w-auto h-14 md:h-16 px-8 bg-gold-500 hover:bg-gold-600 text-white font-medium rounded-2xl md:rounded-full transition-all shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 flex justify-center items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              <span className="md:hidden lg:block whitespace-nowrap">Search Rooms</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
