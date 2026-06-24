"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Shield, Sparkles, MapPin, Coffee, CheckCircle2 } from "lucide-react"

export default function AboutClient() {
  const stats = [
    { number: "2010", label: "Year Established" },
    { number: "10K+", label: "Happy Guests" },
    { number: "18", label: "Luxury Rooms" },
    { number: "24/7", label: "Concierge Service" },
  ]

  const values = [
    { icon: Shield, title: "Uncompromising Quality", desc: "We maintain the highest standards in every aspect of your stay." },
    { icon: Sparkles, title: "Authentic Hospitality", desc: "Our staff is trained to anticipate your needs and deliver warm, personalized service." },
    { icon: MapPin, title: "Prime Location", desc: "Situated near the Jagannath Temple and Puri Beach for perfect convenience." },
  ]

  return (
    <div className="bg-white dark:bg-luxury-darker">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1542314831-c53cd4b85ca4?w=1600&q=80" 
          alt="Hotel The Anand Luxury" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Welcome to Paradise
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-24 h-1 bg-gold-500 mx-auto"
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-luxury">
                <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" alt="Hotel Exterior" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 glass-dark p-8 rounded-xl border border-gold-500/20 max-w-xs shadow-2xl">
                <p className="text-gold-400 font-serif text-4xl font-bold mb-2">New</p>
                <p className="text-white text-sm leading-relaxed">A fresh standard of luxury, opened in May 2026.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold-500 font-medium tracking-widest uppercase mb-3">A New Era of Luxury</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Where Tradition Meets <br/>Modern Elegance
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                <p>
                  Newly opened in May 2026, Hotel The Anand is Puri's newest premier destination for discerning travelers seeking both spiritual proximity and uncompromising luxury.
                </p>
                <p>
                  Every corner of our brand-new hotel has been thoughtfully designed to reflect the rich cultural heritage of Odisha while providing all the state-of-the-art contemporary amenities you expect from a world-class luxury establishment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['Premium Rooms & Suites', 'Ocean View Balconies', 'Ayurvedic Spa Center', '24/7 Concierge'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-luxury-card border-y border-gray-100 dark:border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { number: "2026", label: "Year Established" },
              { number: "100%", label: "Guest Satisfaction" },
              { number: "18", label: "Luxury Rooms" },
              { number: "24/7", label: "Concierge Service" },
            ].map(({ number, label }, i) => (
              <motion.div 
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6"
              >
                <p className="font-serif text-5xl md:text-6xl font-bold text-gold-500 mb-4">{number}</p>
                <p className="text-gray-600 dark:text-gray-300 font-medium tracking-wide uppercase text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gold-500 font-medium tracking-widest uppercase mb-3">Our Core Values</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Hotel The Anand
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div 
                key={val.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 dark:bg-luxury-card p-10 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gold-500/30 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-100 dark:bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <val.icon className="w-8 h-8 text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">{val.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="container-custom relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gold-400 font-medium tracking-widest uppercase mb-3">Beyond Accommodation</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Holistic Wellness <br/>& Rejuvenation
              </h2>
              <div className="w-16 h-1 bg-gold-500 mb-8" />
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Your stay at Hotel The Anand is complemented by our world-class wellness facilities. Find your inner peace at our premium Ayurvedic spa, offering authentic therapies designed to relax your body and mind.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We believe true luxury nourishes both the body and the soul, offering a sanctuary of relaxation amidst the vibrant spiritual energy of Puri.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20">
                  <Image src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" alt="Spa Wellness" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <p className="font-serif text-xl font-bold mt-4 text-gold-400">Premium Ayurvedic Spa</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white dark:bg-luxury-darker relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto bg-gray-50 dark:bg-luxury-card rounded-[2.5rem] p-8 md:p-16 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-16 shadow-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-56 h-56 md:w-72 md:h-72 shrink-0 rounded-full overflow-hidden border-8 border-white dark:border-luxury-dark shadow-2xl ring-1 ring-gold-500/30"
            >
              <Image src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80" alt="Anand Mandal - Founder & Owner" fill className="object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-2">Mr. Anand Mandal</h3>
              <p className="text-gold-500 font-semibold uppercase tracking-[0.2em] text-sm mb-8">Founder & Owner</p>
              
              <div className="relative">
                <span className="absolute -top-6 -left-4 text-6xl text-gold-500/20 font-serif">"</span>
                <p className="text-gray-600 dark:text-gray-400 italic text-xl md:text-2xl leading-relaxed mb-6 border-l-4 border-gold-500 pl-8 relative z-10">
                  Our vision was never just to build a hotel; it was to create a sanctuary where the spiritual essence of Puri meets the pinnacle of modern luxury. Every guest who walks through our doors is treated not as a customer, but as a cherished member of our extended family.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
