"use client"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Mail className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-4xl font-playfair font-semibold text-white mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our mailing list to receive exclusive offers, updates on our latest luxury packages, and insider news from Hotel The Anand.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button type="submit" className="btn-gold whitespace-nowrap px-8 py-4">
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
