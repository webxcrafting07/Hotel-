"use client"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

const PLACEHOLDER_PACKAGES = [
  { id:"1", name:"Romantic Getaway", description:"Perfect for couples seeking a romantic retreat.", price:25000, duration:2, includes:["Deluxe Room","Couple Spa","Candle-lit Dinner","Flower Decoration","Champagne","Late Checkout"] },
  { id:"2", name:"Family Fun Package", description:"Create lasting memories with your family.", price:18000, duration:3, includes:["Family Suite","Breakfast","Kids Activities","Pool Access","City Tour"] },
  { id:"3", name:"Business Traveler", description:"Stay productive with our business-focused package.", price:15000, duration:2, includes:["Superior Room","Breakfast","Airport Transfer","Meeting Room (2hr)","Express Laundry"] },
  { id:"4", name:"Spiritual Retreat", description:"Explore the sacred temples and beaches of Puri.", price:12000, duration:2, includes:["Standard Room","Breakfast","Temple Tour","Beach Walk","Yoga Session"] },
]

export default function PackagesPage() {
  const { data } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      try {
        const res = await api.get("/packages")
        return res.data.data.length > 0 ? res.data.data : PLACEHOLDER_PACKAGES
      } catch { return PLACEHOLDER_PACKAGES }
    },
  })

  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <p className="text-gold-400 text-sm tracking-widest uppercase mb-3">Curated Experiences</p>
        <h1 className="font-serif text-5xl font-bold mb-4">Stay Packages</h1>
        <p className="text-white/70 max-w-xl mx-auto">Handcrafted packages designed to make your stay unforgettable.</p>
      </div>
      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data || PLACEHOLDER_PACKAGES).map((pkg: any, i: number) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="luxury-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                      <p className="text-gold-500 text-sm">{pkg.duration} Night{pkg.duration > 1 ? "s" : ""} Package</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{formatCurrency(pkg.price)}</p>
                      <p className="text-gray-400 text-xs">per package</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{pkg.description}</p>
                  <div className="space-y-2 mb-6">
                    {(pkg.includes || []).map((item: string) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-gold-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="btn-gold w-full justify-center">
                    Book This Package <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
