"use client"
import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, Trash2, X, Plus } from "lucide-react"
import api from "@/lib/api"
import toast from "react-hot-toast"

const CATEGORIES = ["ROOMS","SPA","POOL","EXTERIOR","EVENTS","OTHER"]

export default function AdminGalleryPage() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title:"", category:"ROOMS", description:"" })
  const [activeCategory, setActiveCategory] = useState("ALL")

  const { data } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await api.get("/gallery")
      return res.data.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/gallery/${id}`),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-gallery"] }) },
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("title", form.title)
      fd.append("category", form.category)
      fd.append("description", form.description)
      await api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } })
      toast.success("Image uploaded!")
      qc.invalidateQueries({ queryKey: ["admin-gallery"] })
      setForm({ title:"", category:"ROOMS", description:"" })
    } catch { toast.error("Upload failed") }
    finally { setUploading(false) }
  }

  const filtered = data?.filter((item: any) => activeCategory === "ALL" || item.category === activeCategory) || []
  const inp = "w-full px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data?.length || 0} images</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="btn-gold text-sm py-2 disabled:opacity-50">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Upload Form */}
      <div className="luxury-card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Upload Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Title</label>
            <input className={inp} value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} placeholder="Image title" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Category</label>
            <select className={`${inp} bg-white dark:bg-gray-900`} value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Description</label>
            <input className={inp} value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} placeholder="Optional description" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        <p className="text-xs text-gray-400 mt-3">Max file size: 10MB. Supported formats: JPG, PNG, WebP, MP4</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat ? "bg-gold-500 text-white" : "bg-white dark:bg-luxury-card border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gold-500"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((item: any, i: number) => (
          <motion.div key={item.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.03 }}
            className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
            {item.mediaType === "video" ? (
              <video src={item.url} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => {e.currentTarget.pause(); e.currentTarget.currentTime = 0;}} />
            ) : (
              <Image src={item.url} alt={item.title||""} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-start justify-end p-2">
              <button onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(item.id) }}
                className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{item.title}</p>
              </div>
            )}
          </motion.div>
        ))}

        {/* Upload placeholder */}
        <button onClick={() => fileRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-2 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500/5 transition-all group">
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-gold-500 transition-colors" />
          <span className="text-xs text-gray-400 group-hover:text-gold-500">Upload</span>
        </button>
      </div>
    </div>
  )
}
