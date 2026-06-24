import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"
import Image from "next/image"
import AmenitiesClient from "./AmenitiesClient"

export const metadata: Metadata = { title: "Amenities", description: "World-class amenities at Hotel The Anand Puri" }

export default function AmenitiesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80" 
          alt="Luxury Hotel Amenities" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 w-full">
          <p className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            What We Offer
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Hotel Amenities
          </h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Every amenity crafted to elevate your stay to extraordinary levels of comfort and luxury.
          </p>
        </div>
      </section>
      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <AmenitiesClient />
      </section>
    </MainLayout>
  )
}
