import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"
import Link from "next/link"
import { Tag, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = { title: "Special Offers", description: "Exclusive deals and offers at Hotel The Anand" }

const offers = [
  { code: "WELCOME20", title: "New Guest Welcome", desc: "Get 20% off on your first booking with us. Maximum discount ₹2000.", discount: "20% OFF", validity: "Ongoing", color: "from-gold-500 to-amber-400" },
  { code: "SAVE500", title: "Flat ₹500 Off", desc: "Save ₹500 on bookings above ₹5000. Valid for all room categories.", discount: "₹500 OFF", validity: "Ongoing", color: "from-blue-500 to-indigo-400" },
  { code: "WEEKEND15", title: "Weekend Escape", desc: "15% discount on weekend stays (Friday-Sunday). Book in advance.", discount: "15% OFF", validity: "Every Weekend", color: "from-green-500 to-teal-400" },
  { code: "FESTIVAL25", title: "Festival Special", desc: "Celebrate festivals at Hotel The Anand with 25% off on select dates.", discount: "25% OFF", validity: "Festival Season", color: "from-red-500 to-pink-400" },
]

export default function OffersPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <p className="text-gold-400 text-sm tracking-widest uppercase mb-3">Exclusive Deals</p>
        <h1 className="font-serif text-5xl font-bold mb-4">Special Offers</h1>
        <p className="text-white/70 max-w-xl mx-auto">Unlock exclusive savings and enjoy more of what Hotel The Anand has to offer.</p>
      </div>
      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div key={offer.code} className="luxury-card overflow-hidden group">
                <div className={`bg-gradient-to-r ${offer.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-serif font-bold">{offer.discount}</span>
                    <Tag className="w-10 h-10 opacity-30" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mt-2">{offer.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{offer.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Promo Code</p>
                      <span className="font-mono font-bold text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-500/10 px-3 py-1 rounded-lg">{offer.code}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />Validity</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{offer.validity}</p>
                    </div>
                  </div>
                  <Link href={`/rooms`} className="btn-gold w-full justify-center mt-5 text-sm py-2.5">
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 luxury-card p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              To apply a promo code, enter it during checkout on the booking page. Offers cannot be combined. 
              <Link href="/contact" className="text-gold-500 ml-1 hover:underline">Contact us</Link> for group booking discounts.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
