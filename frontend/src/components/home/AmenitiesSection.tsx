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
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container-custom px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">
            World-Class Amenities
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Every detail has been thoughtfully curated to ensure your stay is nothing short of extraordinary.
          </p>
          <div className="w-12 h-[1px] bg-gold-500 mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {amenities.map((amenity, i) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center mb-6 group-hover:border-gold-500/30 group-hover:bg-gold-50/50 dark:group-hover:bg-gold-500/5 transition-all duration-500">
                <amenity.icon className="w-6 h-6 text-gray-400 group-hover:text-gold-500 transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-3">
                {amenity.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[250px]">
                {amenity.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
