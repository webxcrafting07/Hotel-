"use client"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layout/MainLayout"
import { Calendar, User, Eye, ArrowLeft, Tag } from "lucide-react"
import api from "@/lib/api"
import { formatDate } from "@/lib/utils"

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`)
      return res.data.data
    },
  })

  if (isLoading) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full" />
      </div>
    </MainLayout>
  )

  if (!blog) return (
    <MainLayout>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Blog post not found</p>
        <Link href="/blog" className="btn-gold text-sm">Back to Blog</Link>
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="pt-20">
        {blog.coverImage && (
          <div className="relative h-[50vh] overflow-hidden">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
              {blog.category && <span className="inline-block bg-gold-500 text-white text-xs px-3 py-1 rounded-full mb-3">{blog.category}</span>}
              <h1 className="font-serif text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">{blog.title}</h1>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
          <Link href="/blog" className="flex items-center gap-2 text-gold-500 text-sm mb-8 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {!blog.coverImage && (
            <div className="mb-8">
              {blog.category && <span className="inline-block bg-gold-100 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400 text-xs px-3 py-1 rounded-full mb-4">{blog.category}</span>}
              <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">{blog.title}</h1>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
            {blog.author && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-gold-600 dark:text-gold-400">{blog.author.firstName[0]}{blog.author.lastName[0]}</span>
                </div>
                <span>{blog.author.firstName} {blog.author.lastName}</span>
              </div>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold-500" />{formatDate(blog.publishedAt || blog.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-gold-500" />{blog.viewCount} views</span>
            {blog.tags?.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold-500" />
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {blog.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 italic mb-10 leading-relaxed border-l-4 border-gold-500 pl-6 font-serif">{blog.excerpt}</p>
          )}

          <div
            className="prose dark:prose-invert prose-lg prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-gold-500 prose-img:rounded-2xl prose-img:shadow-luxury prose-strong:text-gray-900 dark:prose-strong:text-white prose-p:first-of-type:first-letter:text-6xl prose-p:first-of-type:first-letter:font-serif prose-p:first-of-type:first-letter:text-gold-500 prose-p:first-of-type:first-letter:mr-2 prose-p:first-of-type:first-letter:float-left max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Share this article:</span>
              <div className="flex gap-2">
                {['Facebook', 'Twitter', 'WhatsApp', 'Email'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-gold-500 hover:border-gold-500 transition-colors">
                    <span className="text-xs">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="btn-gold-outline text-gray-900 dark:text-white border-gold-500 text-sm py-2 px-6">
                 All Posts
              </Link>
              <Link href="/rooms" className="btn-gold text-sm py-2 px-6">Book Your Stay</Link>
            </div>
          </div>

          {blog.author && (
            <div className="mt-12 p-8 rounded-2xl bg-gray-50 dark:bg-luxury-card border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-20 h-20 shrink-0 rounded-full bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center text-2xl font-serif text-gold-600 dark:text-gold-400">
                {blog.author.firstName[0]}{blog.author.lastName[0]}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">Written by {blog.author.firstName} {blog.author.lastName}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Our dedicated author sharing the best travel tips, cultural insights, and hidden gems to make your stay in Puri an unforgettable luxury experience.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
