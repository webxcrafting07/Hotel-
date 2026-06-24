"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export function WelcomeSection() {
  console.log("WelcomeSection mounted");
  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-500 font-medium tracking-widest uppercase mb-4 text-sm">
              — Welcome to Paradise
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-gray-900 mb-6 leading-tight">
              A New Era of Luxury <br />
              in the Heart of Puri
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Nestled along the pristine shores of the Bay of Bengal, Hotel The Anand is an iconic destination that blends timeless elegance with modern sophistication. Our property is designed to be a serene oasis, offering unparalleled comfort and world-class service.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you are here for a spiritual journey to the majestic Jagannath Temple, a romantic getaway, or a peaceful retreat, every moment with us is crafted to be unforgettable.
            </p>
            
            {/* Signature */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-gold-400"></div>
              <div>
                <p className="font-playfair text-xl text-gray-900 font-medium">Anand Mandal</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Owner</p>
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/welcome/exterior.png"
                    alt="Luxury Hotel Exterior"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/welcome/lobby.png"
                    alt="Hotel Interior"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/welcome/bed.png"
                    alt="Luxury Bedding"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/welcome/pool.png"
                    alt="Swimming Pool"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
            
            {/* Experience Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-2xl border-4 border-white">
              <div className="w-full h-full rounded-full border border-gold-300 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-playfair text-gold-500 mb-1 mt-1">Newly</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Opened<br/>Welcome</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
