"use client"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review: "An absolutely stunning hotel! The rooms are luxurious and the staff is incredibly attentive. The spa treatments were divine and the views were exceptional. Will definitely return!",
    stay: "Junior Suite",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, India",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review: "Hotel The Anand exceeded all our expectations. The location is perfect for exploring Puri, the rooms are immaculate, and the service is five-star quality. A true luxury experience.",
    stay: "Presidential Suite",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Bangalore, India",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    review: "We celebrated our anniversary here and it was magical. The honeymoon suite was beautifully decorated, the candle-lit dinner was romantic, and every moment was special. Highly recommended!",
    stay: "Honeymoon Suite",
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-gradient-luxury text-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold-400 text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Guest Experiences
          </p>
          <h2 className="heading-lg text-white mb-4">
            What Our Guests Say
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-16 h-0.5 bg-gold-500" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold-500/20" />
              
              <div className="flex items-center gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                "{t.review}"
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-gold-500/30"
                />
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-gold-400/70 text-xs">{t.location} · {t.stay}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 glass px-8 py-4 rounded-2xl">
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-gold-400">4.9</p>
              <div className="flex gap-1 justify-center mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-left">
              <p className="text-white font-semibold">Overall Rating</p>
              <p className="text-white/50 text-sm">Based on 2,400+ reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
