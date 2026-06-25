"use client"
import { motion } from "framer-motion"
import { Wifi, Bed, Car, Dumbbell, Waves, Tv, Coffee, Shield, Phone, Bath, MapPin, Clock } from "lucide-react"

const amenities = [
  { icon: Wifi, title: "High-Speed WiFi", desc: "Complimentary fiber-optic internet throughout the hotel" },
  { icon: Bed, title: "Premium Bedding", desc: "Plush mattresses and high-thread-count linens" },
  { icon: Waves, title: "Swimming Pool", desc: "Heated infinity pool with panoramic views" },
  { icon: Dumbbell, title: "Fitness Center", desc: "State-of-the-art gym open 24/7" },
  { icon: Bath, title: "Ensuite Bathrooms", desc: "Luxurious bathrooms with premium toiletries" },
  { icon: Car, title: "Valet Parking", desc: "Complimentary valet parking for all guests" },
  { icon: Tv, title: "Smart TVs", desc: "Flat-screen TVs with streaming services" },
  { icon: Coffee, title: "24/7 Room Service", desc: "In-room dining available round the clock" },
  { icon: Shield, title: "24/7 Security", desc: "CCTV surveillance and professional security" },
  { icon: Phone, title: "Concierge", desc: "Personal concierge for all your needs" },
  { icon: MapPin, title: "Prime Location", desc: "Located in the heart of Puri, near beach" },
  { icon: Clock, title: "Express Checkout", desc: "Quick and hassle-free checkout process" },
]

export function AmenitiesSection() {
  return (
    <section className="py-24 relative bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="container-custom px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              What We Offer
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 font-serif italic pr-2">Amenities</span>
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg md:text-right">
            Every detail has been thoughtfully curated to ensure your stay is nothing short of extraordinary.
          </p>
        </motion.div>

        {/* Editorial Mixed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[220px]">
          
          {/* Top Left Large Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group shadow-xl"
          >
            <img 
              src="/images/welcome/pool.png" 
              alt="Luxury Pool" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 pr-8">
              <h3 className="font-serif text-3xl text-white mb-2">Relax & Unwind</h3>
              <p className="text-gray-200 text-sm">Experience our temperature-controlled infinity pool</p>
            </div>
          </motion.div>

          {/* First 4 Amenities */}
          {amenities.slice(0, 4).map((amenity, i) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500 transition-all duration-300">
                <amenity.icon className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{amenity.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{amenity.desc}</p>
            </motion.div>
          ))}

          {/* Next 4 Amenities */}
          {amenities.slice(4, 8).map((amenity, i) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500 transition-all duration-300">
                <amenity.icon className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{amenity.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{amenity.desc}</p>
            </motion.div>
          ))}

          {/* Right Side Large Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group shadow-xl"
          >
            <img 
              src="/images/welcome/bed.png" 
              alt="Premium Bedding" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 pr-8">
              <h3 className="font-serif text-3xl text-white mb-2">Rest & Restore</h3>
              <p className="text-gray-200 text-sm">Discover the meaning of true comfort</p>
            </div>
          </motion.div>

          {/* Last 4 Amenities */}
          {amenities.slice(8, 12).map((amenity, i) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500 transition-all duration-300">
                <amenity.icon className="w-6 h-6 text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{amenity.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{amenity.desc}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}
