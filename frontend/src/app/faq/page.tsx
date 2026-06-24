import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Hotel The Anand, bookings, amenities, and policies.",
}

const faqs = [
  { q: "What are the check-in and check-out times?", a: "Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability." },
  { q: "Is breakfast included in the room rate?", a: "Breakfast is complimentary for Deluxe, Superior, Suite, and Presidential Suite rooms. Standard rooms offer breakfast as an optional add-on." },
  { q: "What is the cancellation policy?", a: "Free cancellation up to 24 hours before check-in. 50% charge for cancellations within 24 hours. No refund for no-shows." },
  { q: "Do you accept credit cards?", a: "Yes, we accept all major credit and debit cards, UPI, net banking, and cash payments at the front desk." },
  { q: "Is the hotel pet-friendly?", a: "We currently do not accommodate pets in our hotel premises." },
  { q: "Do you offer airport transfers?", a: "Yes, we provide airport and railway station pickup/drop services. Please contact us at least 4 hours in advance to arrange." },
  { q: "Is there parking available?", a: "Yes, complimentary valet parking is available for all hotel guests." },
  { q: "Does the hotel have a swimming pool?", a: "Yes, we have a heated outdoor swimming pool available for all guests from 6:00 AM to 10:00 PM." },
  { q: "Can I book a room for a special occasion?", a: "Absolutely! Contact us to arrange special decorations, flowers, cakes, or other arrangements for anniversaries, birthdays, and more." },
  { q: "Is WiFi complimentary?", a: "Yes, high-speed fiber-optic WiFi is complimentary throughout all areas of the hotel." },
]

export default function FAQPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <p className="text-gold-400 text-sm tracking-widest uppercase mb-3">Help Center</p>
        <h1 className="font-serif text-5xl font-bold mb-4">Frequently Asked Questions</h1>
      </div>

      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="luxury-card p-6 group">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white flex items-center justify-between gap-4 list-none">
                  {faq.q}
                  <span className="text-gold-500 group-open:rotate-45 transition-transform duration-200 text-xl shrink-0">+</span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm border-t border-gray-100 dark:border-white/5 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
