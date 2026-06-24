"use client"
import Link from "next/link"
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-luxury-darker dark:bg-black text-gray-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="font-serif text-sm tracking-widest text-gold-500/70 uppercase mb-1">Welcome to</p>
              <h2 className="font-serif text-3xl font-bold text-white">
                Hotel <span className="text-gold-500">The Anand</span>
              </h2>
              <div className="w-12 h-0.5 bg-gold-500 mt-3 mb-4" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Where luxury meets comfort. Experience the finest hospitality in the heart of Puri, Odisha.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6 relative">
              Explore
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold-500" />
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/rooms", label: "Our Rooms" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-4 h-0.5 bg-gold-500/50 group-hover:w-6 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6 relative">
              Policies
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold-500" />
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/cancellation-policy", label: "Cancellation Policy" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-4 h-0.5 bg-gold-500/50 group-hover:w-6 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold-500" />
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 leading-relaxed">
                  Gandhi Labour Foundation Road,<br />
                  Near Silicon Hotel, Puri,<br />
                  Odisha - 752001, India
                </p>
              </div>
              <a href="tel:+919296985454" className="flex items-center gap-3 text-sm text-gray-400 hover:text-gold-500 transition-colors">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                +91-9296985454
              </a>
              <a href="mailto:hoteltheanand5454@gmail.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-gold-500 transition-colors">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                hoteltheanand5454@gmail.com
              </a>
            </div>

            <div className="mt-6 p-4 border border-gold-500/20 rounded-xl bg-gold-500/5">
              <p className="text-xs text-gold-500 font-medium mb-1">Check-in / Check-out</p>
              <p className="text-sm text-gray-300">2:00 PM / 11:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center">
            © {currentYear} Hotel The Anand. All rights reserved. GST: 21ABCDE1234F1Z5
          </p>
          <p className="text-xs text-gray-600">
            Developed by <a href="https://webxcrafting.in" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">WebXCrafting.in</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
