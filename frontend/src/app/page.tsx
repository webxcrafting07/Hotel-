import MainLayout from "@/components/layout/MainLayout"
import { HeroSection } from "@/components/home/HeroSection"
import { BookingWidget } from "@/components/home/BookingWidget"
import { WelcomeSection } from "@/components/home/WelcomeSection"
import { FeaturedRooms } from "@/components/home/FeaturedRooms"
import { AmenitiesSection } from "@/components/home/AmenitiesSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { GallerySection } from "@/components/home/GallerySection"
import { NearbyAttractions } from "@/components/home/NearbyAttractions"
import { InstagramFeed } from "@/components/home/InstagramFeed"
import { LocationMap } from "@/components/home/LocationMap"
import { Newsletter } from "@/components/home/Newsletter"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hotel The Anand | Luxury Hotel in Puri, Odisha",
  description: "Experience unmatched luxury at Hotel The Anand, Puri. Premium rooms, world-class amenities in the heart of Odisha.",
}

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <BookingWidget />
      <WelcomeSection />
      <FeaturedRooms />
      <AmenitiesSection />
      <TestimonialsSection />
      <GallerySection />
      <NearbyAttractions />
      <InstagramFeed />
      <LocationMap />
      <Newsletter />
    </MainLayout>
  )
}
