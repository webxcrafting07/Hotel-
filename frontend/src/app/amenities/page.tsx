import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"
import Image from "next/image"
import AmenitiesClient from "./AmenitiesClient"

export const metadata: Metadata = { title: "Amenities", description: "World-class amenities at Hotel The Anand Puri" }

export default function AmenitiesPage() {
  return (
    <MainLayout>
      {/* Premium Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80" 
          alt="Luxury Hotel Amenities" 
          fill 
          className="object-cover"
          priority
        />
        {/* Rich gradient overlays for depth */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="relative z-10 text-center text-white px-4 w-full mt-20">
          <p className="text-gold-400 font-serif text-sm md:text-base tracking-[0.4em] uppercase mb-6 drop-shadow-md">
            The Pinnacle of Luxury
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 drop-shadow-xl">
            World-Class Amenities
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" />
          <p className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide leading-relaxed drop-shadow-md">
            Immerse yourself in an oasis of comfort. Every detail has been meticulously crafted to elevate your stay to extraordinary new heights.
          </p>
        </div>
      </section>
      
      <section className="section-padding bg-[#fafafa] dark:bg-[#050505]">
        <AmenitiesClient />
      </section>
    </MainLayout>
  )
}
