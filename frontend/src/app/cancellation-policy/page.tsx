import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Cancellation Policy", description: "Cancellation and Refund Policy of Hotel The Anand" }

export default function CancellationPolicyPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Cancellation Policy</h1>
      </div>
      <section className="section-padding bg-white dark:bg-luxury-darker">
        <div className="container-custom max-w-3xl">
          <div className="space-y-6">
            {[
              { title: "Free Cancellation", desc: "Cancel up to 24 hours before check-in for a full refund. No questions asked.", color: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30" },
              { title: "50% Refund", desc: "Cancellations made within 24 hours of check-in receive a 50% refund of the total booking amount.", color: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30" },
              { title: "No Refund", desc: "No-shows or cancellations after check-in time will not receive a refund.", color: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" },
              { title: "Festival Period", desc: "Bookings during festival seasons (Rath Yatra, Diwali, etc.) may have different cancellation terms. Please check at booking.", color: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30" },
            ].map(({ title, desc, color }) => (
              <div key={title} className={`p-6 rounded-2xl border ${color}`}>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
            <div className="luxury-card p-6">
              <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">Refund Processing Time</h3>
              <p className="text-gray-600 dark:text-gray-400">Approved refunds are processed within 5-7 business days to the original payment method. For UPI payments, refunds may take 3-5 business days.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
