"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80", span: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80", span: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80", span: "col-span-1 row-span-1" },
]

export function GallerySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold-500 font-medium tracking-widest uppercase mb-4 text-sm">
            — Visual Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-gray-900 mb-6">
            Glimpse of Luxury
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-xl overflow-hidden group ${img.span}`}
            >
              <Image 
                src={img.src} 
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
