"use client"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail } from "lucide-react"

export function LocationMap() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row"
        >
          {/* Content Side */}
          <div className="w-full lg:w-5/12 p-10 md:p-16 flex flex-col justify-center bg-white relative z-10 shadow-[20px_0_30px_-15px_rgba(0,0,0,0.05)]">
            <p className="text-gold-500 font-medium tracking-widest uppercase mb-4 text-sm">
              — Find Us
            </p>
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-900 mb-10">
              Location & Contact
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Address</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Gandhi Labour Foundation Road,<br/>
                    Near Silicon Hotel,<br/>
                    Puri, Odisha - 752001
                  </p>
                </div>
              </div>
              
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Contact</h4>
                  <p className="text-gray-600">+91-9296985454</p>
                </div>
              </div>
              
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Email</h4>
                  <p className="text-gray-600">hoteltheanand5454@gmail.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <a 
                href="https://maps.app.goo.gl/7rz3inQJqgdKzDBL8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Map Side */}
          <div className="w-full lg:w-7/12 h-[400px] lg:h-auto relative bg-gray-200">
            <iframe 
              src="https://maps.google.com/maps?q=Hotel+Anand,+Gandhi+Labour+Foundation+Road,+Near+Silicon+Hotel,+Puri,+Odisha&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full border-0 grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
