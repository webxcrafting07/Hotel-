import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Refund Policy", description: "Refund Policy of Hotel The Anand" }

export default function RefundPolicyPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Refund Policy</h1>
      </div>
      <section className="section-padding bg-white dark:bg-luxury-darker">
        <div className="container-custom max-w-3xl prose dark:prose-invert prose-headings:font-serif prose-p:text-gray-600 dark:prose-p:text-gray-400 max-w-none">
          <h2>Refund Eligibility</h2>
          <p>Refunds are issued based on our cancellation policy. Eligible refunds are processed to the original payment method used at the time of booking.</p>
          <h2>Processing Time</h2>
          <ul>
            <li>Credit/Debit Card: 5-7 business days</li>
            <li>UPI/Net Banking: 3-5 business days</li>
            <li>Cash Payments: Refunded at check-out</li>
          </ul>
          <h2>Non-Refundable Situations</h2>
          <ul>
            <li>No-shows without prior cancellation</li>
            <li>Early check-out (charges for full booked period apply)</li>
            <li>Violation of hotel policies leading to eviction</li>
          </ul>
          <h2>How to Request a Refund</h2>
          <p>To request a refund, contact us at hoteltheanand5454@gmail.com or call +91-9296985454 with your booking number and reason for cancellation.</p>
        </div>
      </section>
    </MainLayout>
  )
}
