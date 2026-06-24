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
    <section className="section-padding bg-white dark:bg-luxury-darker">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold-500 text-sm font-medium tracking-[0.3em] uppercase mb-3">
            What We Offer
          </p>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            World-Class Amenities
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Every detail has been thoughtfully curated to ensure your stay is nothing short of extraordinary.
          </p>
          <div className="flex justify-center mt-4">
            <div className="w-16 h-0.5 bg-gold-500" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, i) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gold-500/30 hover:bg-gold-50/50 dark:hover:bg-gold-500/5 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                <amenity.icon className="w-5 h-5 text-gold-600 dark:text-gold-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{amenity.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{amenity.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
