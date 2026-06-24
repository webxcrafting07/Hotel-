"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import toast from "react-hot-toast"

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    setLoading(false)
  }

  const inp = "w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 dark:text-white transition-all shadow-sm"

  return (
    <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Hotel The Anand</h2>
              <div className="w-12 h-0.5 bg-gold-500 mb-4" />
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, title: "Address", lines: ["Near Silicon Hotel", "Puri, Odisha - 752001"] },
                  { icon: Phone, title: "Phone", lines: ["+91-9296985454", "+91-92966885454"] },
                  { icon: Mail, title: "Email", lines: ["hoteltheanand5454@gmail.com"] },
                  { icon: Clock, title: "Hours", lines: ["Check-in: 2 PM", "Check-out: 11 AM"] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-luxury-card border border-gray-100 dark:border-white/5 hover:border-gold-500/30 transition-colors shadow-sm overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                      {lines.map((l) => <p key={l} className="text-gray-500 dark:text-gray-400 text-xs break-all">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Connect</p>
              <div className="flex gap-3">
                <a href="https://wa.me/919296985454" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href="tel:+919296985454" className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-white rounded-xl text-sm font-medium hover:bg-gold-600 transition-colors">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 h-64 bg-gray-200 dark:bg-gray-700 shadow-luxury">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119853.80556213876!2d85.74614214227848!3d19.814041793392576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19c4180256e495%3A0x496a9d8b30c1fad7!2sPuri%2C%20Odisha!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-3 luxury-card p-8"
          >
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Name*</label>
                  <input className={inp} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Phone</label>
                  <input className={inp} type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+91-XXXXXXXXXX" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Email*</label>
                <input className={inp} type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Subject</label>
                <select className={`${inp} bg-white dark:bg-gray-900`} value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}>
                  <option value="">Select a subject</option>
                  <option>Room Reservation</option>
                  <option>Special Request</option>
                  <option>Event Planning</option>
                  <option>General Inquiry</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Message*</label>
                <textarea className={`${inp} resize-none`} rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="How can we help you?" required />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-50">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending...</span>
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
