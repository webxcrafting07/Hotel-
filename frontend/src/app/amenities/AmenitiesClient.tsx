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
    <div className="container-custom space-y-24">
      {amenityGroups.map((group, gi) => (
        <div key={group.title} className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="flex flex-col items-center text-center mb-16"
          >
            <span className="text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">0{gi + 1}</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{group.title}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {group.items.map((item, i) => (
              <motion.div 
                key={item.name} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-lg shadow-black/[0.03] dark:shadow-none lg:hover:-translate-y-2 lg:hover:shadow-2xl lg:hover:border-gold-500/30 transition-all duration-500 group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold-500 transition-all duration-500">
                  <item.icon className="w-7 h-7 text-gold-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
