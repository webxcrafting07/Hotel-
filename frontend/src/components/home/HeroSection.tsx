"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, Star, Award, Users, Coffee } from "lucide-react"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* Animated particles */}
      {isMounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/40 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-20, 20], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 md:pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium tracking-[0.3em] uppercase border border-gold-500/30 px-4 py-2 rounded-full backdrop-blur-sm bg-gold-500/5">
            <Star className="w-3 h-3 fill-gold-400" />
            Five Star Luxury Experience
            <Star className="w-3 h-3 fill-gold-400" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
        >
          Hotel{" "}
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #e8c878, #C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Anand
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/80 text-lg md:text-xl font-light tracking-wide mb-3"
        >
          Where Luxury Meets the Soul of Puri
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gold-400/70 text-sm tracking-widest uppercase mb-10"
        >
          Puri, Odisha — India
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/rooms" className="btn-gold text-base px-8 py-4">
            Explore Rooms
          </Link>
          <Link href="/contact" className="btn-gold-outline text-base px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900">
            Contact Us
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { icon: Star, value: "18", label: "Luxury Rooms" },
            { icon: Award, value: "5★", label: "Hotel Rating" },
            { icon: Users, value: "10K+", label: "Happy Guests" },
            { icon: Coffee, value: "24/7", label: "Room Service" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon className="w-5 h-5 text-gold-400" />
              </div>
              <p className="text-white text-2xl font-serif font-bold">{value}</p>
              <p className="text-white/50 text-xs tracking-wide">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
