"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram, Heart, MessageCircle } from "lucide-react"

const INSTAGRAM_POSTS = [
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80", likes: 245, comments: 18 },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80", likes: 312, comments: 24 },
  { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80", likes: 189, comments: 12 },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80", likes: 421, comments: 36 },
  { src: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80", likes: 276, comments: 15 },
]

export function InstagramFeed() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <p className="text-gold-500 font-medium tracking-widest uppercase mb-2 text-sm">
              — Social Life
            </p>
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-900">
              #HotelTheAnand
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gold-500 transition-colors mt-4 md:mt-0">
            <Instagram className="w-5 h-5" />
            Follow Us on Instagram
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl"
            >
              <Image 
                src={post.src} 
                alt={`Instagram post ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
