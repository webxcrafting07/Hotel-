"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layout/MainLayout"
import { Calendar, User, Eye, ArrowRight, Search } from "lucide-react"
import api from "@/lib/api"
import { Blog } from "@/types"
import { formatDate, truncate } from "@/lib/utils"

const PLACEHOLDER_BLOGS = [
  { id:"1", title:"Top 10 Things to Do in Puri", slug:"top-10-things-to-do-in-puri", excerpt:"Discover the best attractions, temples, and beaches that make Puri a must-visit destination.", coverImage:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", category:"Travel", viewCount:1240, publishedAt:"2024-01-15", author:{firstName:"Rahul",lastName:"Kumar"} },
  { id:"2", title:"Jagannath Rath Yatra: A Divine Experience", slug:"jagannath-rath-yatra-divine-experience", excerpt:"Experience the magnificent chariot festival of Lord Jagannath, one of the largest religious gatherings in the world.", coverImage:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800", category:"Culture", viewCount:890, publishedAt:"2024-01-10", author:{firstName:"Priya",lastName:"Sharma"} },
  { id:"3", title:"Odisha Cuisine: A Culinary Journey", slug:"odisha-cuisine-culinary-journey", excerpt:"Explore the rich and diverse flavors of Odia cuisine, from Pakhala to fresh seafood delicacies.", coverImage:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800", category:"Food", viewCount:654, publishedAt:"2024-01-05", author:{firstName:"Ananya",lastName:"Patel"} },
]

export default function BlogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("ALL")

  const { data } = useQuery({
    queryKey: ["blogs", search, category],
    queryFn: async () => {
      try {
        const params: any = {}
        if (search) params.search = search
        if (category !== "ALL") params.category = category
        const res = await api.get("/blogs", { params })
        return res.data.data.length > 0 ? res.data.data as Blog[] : PLACEHOLDER_BLOGS
      } catch { return PLACEHOLDER_BLOGS }
    },
  })

  const categories = ["ALL", "Travel", "Culture", "Food", "Lifestyle", "Hotel News"]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/1280px-Shri_Jagannath_temple.jpg" 
          alt="Shri Jagannath Temple Puri" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white px-4 w-full">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-serif text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Stories & Insights
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Our Blog
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-24 h-1 bg-gold-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 max-w-xl mx-auto text-lg"
          >
            Travel tips, cultural insights, and stories from the heart of Puri.
          </motion.p>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between p-3 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${category === cat ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105" : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-shadow" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(data || PLACEHOLDER_BLOGS).map((blog: any, i: number) => (
              <motion.article key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
                className="luxury-card overflow-hidden group">
                <div className="relative h-52 overflow-hidden">
                  <Image src={blog.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"} alt={blog.title}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {blog.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold-500 text-white text-xs px-3 py-1 rounded-full">{blog.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    {blog.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{blog.author.firstName} {blog.author.lastName}</span>}
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.viewCount}</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                  <Link href={`/blog/${blog.slug}`} className="flex items-center gap-1 text-gold-500 text-sm font-medium hover:gap-2 transition-all group">
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
