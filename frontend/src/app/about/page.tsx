import MainLayout from "@/components/layout/MainLayout"
import { Metadata } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Hotel The Anand's legacy of luxury and hospitality in Puri, Odisha.",
}

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutClient />
    </MainLayout>
  )
}
