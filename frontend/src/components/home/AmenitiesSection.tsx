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
  const getSpanClass = (i: number) => {
    if (i === 0 || i === 5 || i === 8 || i === 11) return "lg:col-span-2"
    return "lg:col-span-1"
  }

  return (
    <section className="section-padding relative overflow-hidden bg-gray-50 dark:bg-luxury-darker">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gold-500/5 blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            What We Offer
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            World-Class Amenities
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Every detail has been thoughtfully curated to ensure your stay is nothing short of extraordinary. Experience unparalleled luxury and comfort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {amenities.map((amenity, i) => {
            const isWide = i === 0 || i === 5 || i === 8 || i === 11;
            return (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className={`group relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gold-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-2xl transition-all duration-500 ${getSpanClass(i)}`}
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`relative z-10 flex ${isWide ? 'flex-col sm:flex-row items-start sm:items-center text-left gap-6' : 'flex-col items-center text-center gap-4'}`}>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gold-400 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/10 flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors duration-500 shadow-sm group-hover:shadow-gold-500/30">
                      <amenity.icon className="w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                      {amenity.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                      {amenity.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
