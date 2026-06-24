"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Gift, GlassWater, Utensils, Heart } from "lucide-react"

const OFFERS = [
  {
    id: "romantic-getaway",
    title: "Romantic Getaway",
    description: "Perfect for couples seeking a romantic retreat. Includes spa, candle-lit dinner, and room decorated with flowers.",
    price: 25000,
    duration: "2 Nights",
    image: "https://images.unsplash.com/photo-1518182170546-076616fdcefa?auto=format&fit=crop&q=80",
    icon: <Heart className="w-5 h-5" />,
    features: ["Deluxe Room", "Couple Spa", "Candle-lit Dinner"],
  },
  {
    id: "family-fun",
    title: "Family Fun Package",
    description: "Create lasting memories with your family. Includes activities for kids and relaxation for adults.",
    price: 18000,
    duration: "3 Nights",
    image: "https://images.unsplash.com/photo-1536696428787-8e67f0fa90f1?auto=format&fit=crop&q=80",
    icon: <Gift className="w-5 h-5" />,
    features: ["Family Suite", "Breakfast", "Kids Activities"],
  },
  {
    id: "business-traveler",
    title: "Business Retreat",
    description: "Stay productive with our business-focused package including meeting facilities and express services.",
    price: 15000,
    duration: "2 Nights",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80",
    icon: <GlassWater className="w-5 h-5" />,
    features: ["Superior Room", "Airport Transfer", "Meeting Room"],
  }
]

export function ExclusiveOffers() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold-500 font-medium tracking-widest uppercase mb-4 text-sm">
            — Special Packages
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-gray-900 mb-6">
            Exclusive Offers
          </h2>
          <p className="text-gray-600">
            Elevate your stay with our thoughtfully curated packages designed to offer you the best of Hotel The Anand at exceptional value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="font-semibold text-gray-900">₹{offer.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-500"> / {offer.duration}</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="w-10 h-10 bg-gold-50 rounded-full flex items-center justify-center text-gold-500 mb-6">
                  {offer.icon}
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-3 group-hover:text-gold-500 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {offer.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700 gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-400"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href={`/offers/${offer.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gold-500 transition-colors uppercase tracking-wider"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
