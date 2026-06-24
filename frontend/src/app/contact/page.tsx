import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"
import Image from "next/image"
import { ContactSection } from "@/components/common/ContactSection"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Hotel The Anand. We are here to help with your booking, questions, or any assistance you need.",
}

export default function ContactPage() {
  return (
    <MainLayout>
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80" 
          alt="Contact Hotel The Anand" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            Get In Touch
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            We are available 24/7 to assist you with bookings, inquiries, and anything else you need to make your stay perfect.
          </p>
        </div>
      </section>
      
      <ContactSection />
    </MainLayout>
  )
}
