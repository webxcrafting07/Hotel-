"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import MainLayout from "@/components/layout/MainLayout"
import { X, ZoomIn } from "lucide-react"
import api from "@/lib/api"

const CATEGORIES = ["ALL", "ROOMS", "SPA", "POOL", "EXTERIOR", "EVENTS"]

const PLACEHOLDER_IMAGES = [
  { id:"1", url:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", title:"Deluxe Room", category:"ROOMS" },
  { id:"2", url:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", title:"Hotel Exterior", category:"EXTERIOR" },
  
  { id:"4", url:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800", title:"Spa", category:"SPA" },
  { id:"5", url:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", title:"Pool Area", category:"POOL" },
  { id:"6", url:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", title:"Suite", category:"ROOMS" },
  { id:"7", url:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", title:"Lobby", category:"EXTERIOR" },
  { id:"8", url:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", title:"Event Hall", category:"EVENTS" },
  { id:"9", url:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800", title:"Presidential Suite", category:"ROOMS" },
]



export default function GalleryPage() {
  const [active, setActive] = useState("ALL")
  const [selected, setSelected] = useState<any>(null)

  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      try {
        const res = await api.get("/gallery")
        return res.data.data && res.data.data.length > 0 ? res.data.data : PLACEHOLDER_IMAGES
      } catch { return PLACEHOLDER_IMAGES }
    },
  })

  const filtered = data?.filter((item: any) => active === "ALL" || item.category === active) || []

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" 
          alt="Hotel The Anand Gallery" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 w-full">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Visual Journey
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Gallery
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-24 h-1 bg-gold-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 max-w-xl mx-auto text-lg"
          >
            A glimpse into the luxury, architecture, and beauty of Hotel The Anand.
          </motion.p>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          <div className="flex gap-3 justify-center flex-wrap mb-12 p-2 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 w-fit mx-auto">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${active === cat ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105" : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-400"}`}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No images found in this category.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((item: any, i: number) => (
                <motion.div key={item.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}
                  className="break-inside-avoid group cursor-pointer relative rounded-xl overflow-hidden"
                  onClick={() => setSelected(item)}>
                  <div className="relative">
                    {item.mediaType === "video" ? (
                      <video src={item.url} className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => {e.currentTarget.pause(); e.currentTarget.currentTime = 0;}} />
                    ) : (
                      <Image src={item.url} alt={item.title || ""} width={600} height={400}
                        className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                        <p className="text-white text-sm font-medium">{item.title}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 text-white hover:text-gold-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
              {selected.mediaType === "video" ? (
                <video src={selected.url} className="w-full rounded-xl object-contain max-h-[80vh]" controls autoPlay />
              ) : (
                <Image src={selected.url} alt={selected.title || ""} width={1200} height={800}
                  className="w-full rounded-xl object-contain max-h-[80vh]" />
              )}
              {selected.title && <p className="text-white text-center mt-3 font-medium">{selected.title}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  )
}
