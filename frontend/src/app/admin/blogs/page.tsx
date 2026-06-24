"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { Blog } from "@/types"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import Image from "next/image"

export default function AdminBlogsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editBlog, setEditBlog] = useState<Blog | null>(null)

  const { data } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs?limit=50")
      return res.data.data as Blog[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => { toast.success("Blog deleted"); qc.invalidateQueries({ queryKey: ["admin-blogs"] }) },
  })

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      api.put(`/blogs/${id}`, { isPublished }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-blogs"] }) },
  })

  const filtered = data?.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data?.length || 0} posts</p>
        </div>
        <button onClick={() => { setEditBlog(null); setShowModal(true) }} className="btn-gold text-sm py-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500" />
        </div>

        <div className="space-y-3">
          {filtered.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gold-500/30 transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{blog.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${blog.isPublished ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-white/10"}`}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {blog.category && <span className="text-gold-500">{blog.category}</span>}
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                  <span>{blog.viewCount} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePublish.mutate({ id:blog.id, isPublished:!blog.isPublished })}
                  className={`p-1.5 rounded-lg transition-colors ${blog.isPublished ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"}`}>
                  {blog.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { setEditBlog(blog); setShowModal(true) }}
                  className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(blog.id) }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          {!filtered.length && (
            <div className="text-center py-12 text-gray-400">
              <p>No blog posts yet</p>
              <button onClick={() => setShowModal(true)} className="btn-gold text-sm mt-4">Create First Post</button>
            </div>
          )}
        </div>
      </div>

      {showModal && <BlogModal blog={editBlog} onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); qc.invalidateQueries({ queryKey: ["admin-blogs"] }) }} />}
    </div>
  )
}

function BlogModal({ blog, onClose, onSuccess }: { blog: Blog|null; onClose:()=>void; onSuccess:()=>void }) {
  const [form, setForm] = useState({
    title: blog?.title || "", category: blog?.category || "", excerpt: blog?.excerpt || "",
    content: blog?.content || "", tags: blog?.tags?.join(", ") || "", isPublished: blog?.isPublished || false,
    metaTitle: blog?.metaTitle || "", metaDesc: (blog as any)?.metaDesc || "", coverImage: blog?.coverImage || ""
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const inp = "w-full px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) }
      if (blog) await api.put(`/blogs/${blog.id}`, payload)
      else await api.post("/blogs", payload)
      toast.success(blog ? "Updated!" : "Created!")
      onSuccess()
    } catch { toast.error("Failed to save") }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("title", "Blog Cover")
      fd.append("category", "OTHER")
      const res = await api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } })
      setForm(prev => ({ ...prev, coverImage: res.data.data.url }))
      toast.success("Cover image uploaded")
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-luxury-dark rounded-2xl shadow-luxury w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">{blog ? "Edit Post" : "New Blog Post"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Title*</label>
            <input className={inp} value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Cover Image</label>
            {form.coverImage && (
              <div className="relative w-full h-32 mb-2 rounded-xl overflow-hidden">
                <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
                <button type="button" onClick={() => setForm({...form, coverImage: ""})} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500">
                  &times;
                </button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100" />
            {uploadingImage && <p className="text-xs text-gold-500 mt-1">Uploading...</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Category</label>
              <select className={`${inp} bg-white dark:bg-gray-900`} value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}>
                {["Travel","Culture","Food","Lifestyle","Hotel News"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
              <input className={inp} value={form.tags} onChange={(e) => setForm({...form, tags:e.target.value})} placeholder="puri, odisha, travel" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Excerpt</label>
            <textarea className={`${inp} resize-none`} rows={2} value={form.excerpt} onChange={(e) => setForm({...form, excerpt:e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Content* (HTML supported)</label>
            <textarea className={`${inp} resize-none`} rows={8} value={form.content} onChange={(e) => setForm({...form, content:e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Meta Title</label>
              <input className={inp} value={form.metaTitle} onChange={(e) => setForm({...form, metaTitle:e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Meta Description</label>
              <input className={inp} value={form.metaDesc} onChange={(e) => setForm({...form, metaDesc:e.target.value})} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished:e.target.checked})}
              className="rounded border-gray-300 text-gold-500 focus:ring-gold-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-gold justify-center py-2.5 disabled:opacity-50">
              {loading ? "Saving..." : blog ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
