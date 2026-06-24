import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms and Conditions of Hotel The Anand" }

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-white/70">Last updated: January 2024</p>
      </div>
      <section className="section-padding bg-white dark:bg-luxury-darker">
        <div className="container-custom max-w-3xl prose dark:prose-invert prose-headings:font-serif prose-p:text-gray-600 dark:prose-p:text-gray-400 max-w-none">
          <h2>1. Booking & Reservations</h2>
          <p>All bookings are subject to availability. A valid credit card is required to guarantee your reservation. Prices are quoted in Indian Rupees (INR) and include applicable taxes.</p>
          <h2>2. Check-in / Check-out</h2>
          <p>Check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in or late check-out may be available for an additional fee, subject to availability.</p>
          <h2>3. Payment Policy</h2>
          <p>Full payment is required at check-in. We accept all major credit cards, debit cards, UPI, and net banking. Cash payments are accepted at the front desk.</p>
          <h2>4. Guest Conduct</h2>
          <p>Guests are expected to conduct themselves in a manner respectful to other guests and hotel staff. The hotel reserves the right to refuse service or remove guests who violate this policy.</p>
          <h2>5. Damage Policy</h2>
          <p>Guests are liable for any damage caused to hotel property. The cost of repairs will be charged to the guest's payment method on file.</p>
          <h2>6. Smoking Policy</h2>
          <p>Hotel The Anand is a non-smoking property. Smoking is strictly prohibited inside rooms and common areas. A cleaning fee of ₹5,000 will be charged for violations.</p>
          <h2>7. Liability</h2>
          <p>Hotel The Anand is not liable for loss of personal property. Guests are advised to use the in-room safe or front desk safe for valuables.</p>
        </div>
      </section>
    </MainLayout>
  )
}
