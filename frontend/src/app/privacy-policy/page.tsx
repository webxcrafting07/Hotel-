import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy", description: "Privacy Policy of Hotel The Anand" }

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-white/70">Last updated: January 2024</p>
      </div>
      <section className="section-padding bg-white dark:bg-luxury-darker">
        <div className="container-custom max-w-3xl prose dark:prose-invert prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 max-w-none">
          <h2>1. Information We Collect</h2>
          <p>Hotel The Anand collects information you provide directly, including name, email address, phone number, payment information, and any communication you send us. We also collect usage data automatically when you visit our website.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to process bookings, send confirmation emails, improve our services, send promotional offers (with your consent), and comply with legal obligations.</p>
          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment processing through Razorpay and Stripe, and regular security audits to protect your personal information.</p>
          <h2>4. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings.</p>
          <h2>5. Third-Party Sharing</h2>
          <p>We do not sell your personal information to third parties. We may share data with payment processors, email service providers, and analytics tools strictly for service delivery purposes.</p>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at hoteltheanand5454@gmail.com to exercise these rights.</p>
          <h2>7. Contact</h2>
          <p>For privacy concerns, email us at hoteltheanand5454@gmail.com or call +91-9296985454.</p>
        </div>
      </section>
    </MainLayout>
  )
}
