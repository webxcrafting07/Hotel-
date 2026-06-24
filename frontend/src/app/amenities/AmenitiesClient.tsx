"use client"
import { motion } from "framer-motion"
import { Wifi, Car, Dumbbell, Waves, UtensilsCrossed, Sparkles, Shield, Coffee, Phone, MapPin, Bed, Clock } from "lucide-react"

const amenityGroups = [
  {
    title: "Rooms & Comfort",
    items: [
      { icon: Bed, name: "Luxury Beds", desc: "Premium mattresses with Egyptian cotton linens" },
      { icon: Wifi, name: "High-Speed WiFi", desc: "1 Gbps fiber-optic internet throughout" },
      { icon: Coffee, name: "Mini Bar", desc: "Stocked with premium beverages and snacks" },
      { icon: Clock, name: "24/7 Room Service", desc: "In-room dining available round the clock" },
    ],
  },
  {
    title: "Recreation",
    items: [
      { icon: Waves, name: "Swimming Pool", desc: "Heated outdoor pool with loungers" },
      { icon: Dumbbell, name: "Fitness Center", desc: "State-of-the-art gym equipment" },
      { icon: Sparkles, name: "Spa & Wellness", desc: "Ayurvedic and modern therapies" },
      
    ],
  },
  {
    title: "Services",
    items: [
      { icon: Car, name: "Valet Parking", desc: "Complimentary secure parking" },
      { icon: Phone, name: "Concierge", desc: "Personal assistance 24/7" },
      { icon: Shield, name: "24/7 Security", desc: "CCTV and professional security" },
      { icon: MapPin, name: "Tour Desk", desc: "Local sightseeing arrangements" },
    ],
  },
]

export default function AmenitiesClient() {
  return (
    <div className="container-custom space-y-16">
      {amenityGroups.map((group, gi) => (
        <div key={group.title}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">{group.title}</h2>
            <div className="w-12 h-0.5 bg-gold-500" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {group.items.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="luxury-card p-8 text-center group border border-transparent hover:border-gold-500/30 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gold-100 dark:bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-gold-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
