"use client"
import { useState, useRef, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Edit, Trash2, Search, Eye, X, Upload, Image as ImageIcon,
  Video, Star, Tag, Percent, IndianRupee, BedDouble, Users, Bath,
  Check, AlertCircle, GripVertical, Crown
} from "lucide-react"
import api from "@/lib/api"
import { Room, Amenity } from "@/types"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

const ROOM_TYPES = ["STANDARD", "DELUXE", "SUPERIOR", "JUNIOR_SUITE", "SUITE", "PRESIDENTIAL_SUITE"]
const BED_TYPES = ["SINGLE", "DOUBLE", "QUEEN", "KING", "TWIN"]
const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  OCCUPIED: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  MAINTENANCE: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  CLEANING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  RESERVED: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
}

interface RoomForm {
  roomNumbers: string
  name: string
  description: string
  roomType: string
  bedType: string
  floor: string
  basePrice: string
  pricePerNight: string
  weekendPrice: string
  festivalPrice: string
  maxAdults: string
  maxChildren: string
  maxOccupancy: string
  bathrooms: string
  size: string
  hasBalcony: boolean
  hasWifi: boolean
  hasAC: boolean
  hasBreakfast: boolean
  hasTV: boolean
  hasRoomService: boolean
  cancelPolicy: string
  amenityIds: string[]
}

const defaultForm: RoomForm = {
  roomNumbers: "", name: "", description: "", roomType: "STANDARD", bedType: "KING",
  floor: "", basePrice: "", pricePerNight: "", weekendPrice: "", festivalPrice: "",
  maxAdults: "2", maxChildren: "1", maxOccupancy: "3", bathrooms: "1", size: "",
  hasBalcony: false, hasWifi: true, hasAC: true, hasBreakfast: false, hasTV: true, hasRoomService: true,
  cancelPolicy: "Free cancellation up to 24 hours before check-in. 50% charge for cancellation within 24 hours.",
  amenityIds: [],
}

export default function AdminRoomsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editRoom, setEditRoom] = useState<Room | null>(null)
  const [form, setForm] = useState<RoomForm>(defaultForm)
  const [mediaTab, setMediaTab] = useState<"details" | "media">("details")
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const res = await api.get("/rooms?limit=50")
      return res.data.data as Room[]
    },
  })

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      const res = await api.get("/rooms/amenities")
      return res.data.data as Amenity[]
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post("/rooms", data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Room(s) created!")
      qc.invalidateQueries({ queryKey: ["admin-rooms"] })
      setShowModal(false)
      setForm(defaultForm)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create room"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => api.put(`/rooms/${id}`, data),
    onSuccess: () => {
      toast.success("Room updated!")
      qc.invalidateQueries({ queryKey: ["admin-rooms"] })
      setShowModal(false)
      setEditRoom(null)
      setForm(defaultForm)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update room"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/rooms/${id}`),
    onSuccess: () => { toast.success("Room deleted"); qc.invalidateQueries({ queryKey: ["admin-rooms"] }) },
  })

  const uploadMutation = useMutation({
    mutationFn: ({ roomId, formData }: { roomId: string; formData: FormData }) =>
      api.post(`/rooms/${roomId}/images`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: () => {
      toast.success("Files uploaded!")
      qc.invalidateQueries({ queryKey: ["admin-rooms"] })
      qc.invalidateQueries({ queryKey: ["room"] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Upload failed"),
  })

  const deleteImageMutation = useMutation({
    mutationFn: ({ roomId, imageId }: { roomId: string; imageId: string }) =>
      api.delete(`/rooms/${roomId}/images/${imageId}`),
    onSuccess: () => {
      toast.success("Image deleted")
      qc.invalidateQueries({ queryKey: ["admin-rooms"] })
    },
  })

  const setPrimaryMutation = useMutation({
    mutationFn: ({ roomId, imageId }: { roomId: string; imageId: string }) =>
      api.put(`/rooms/${roomId}/images/${imageId}/primary`),
    onSuccess: () => {
      toast.success("Primary image set")
      qc.invalidateQueries({ queryKey: ["admin-rooms"] })
    },
  })

  const openEdit = (room: Room) => {
    setEditRoom(room)
    setForm({
      roomNumbers: room.roomNumber,
      name: room.name,
      description: room.description,
      roomType: room.roomType,
      bedType: room.bedType,
      floor: room.floor.toString(),
      basePrice: room.basePrice?.toString() || "",
      pricePerNight: room.pricePerNight.toString(),
      weekendPrice: room.weekendPrice.toString(),
      festivalPrice: room.festivalPrice.toString(),
      maxAdults: room.maxAdults.toString(),
      maxChildren: room.maxChildren.toString(),
      maxOccupancy: room.maxOccupancy.toString(),
      bathrooms: room.bathrooms.toString(),
      size: room.size?.toString() || "",
      hasBalcony: room.hasBalcony,
      hasWifi: room.hasWifi,
      hasAC: room.hasAC,
      hasBreakfast: room.hasBreakfast,
      hasTV: room.hasTV,
      hasRoomService: room.hasRoomService,
      cancelPolicy: room.cancelPolicy || "",
      amenityIds: room.amenities?.map((a) => a.amenity.id) || [],
    })
    setMediaTab("details")
    setShowModal(true)
  }

  const openNew = () => {
    setEditRoom(null)
    setForm(defaultForm)
    setMediaTab("details")
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Record<string, unknown> = {
      ...form,
      floor: form.floor ? parseInt(form.floor) : undefined,
    }
    if (editRoom) {
      const { roomNumbers, ...rest } = payload
      updateMutation.mutate({ id: editRoom.id, data: rest })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !editRoom) return
    setUploadingFiles(true)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    try {
      await uploadMutation.mutateAsync({ roomId: editRoom.id, formData })
    } finally {
      setUploadingFiles(false)
    }
  }

  const discountPercent = (() => {
    const base = parseFloat(form.basePrice)
    const offer = parseFloat(form.pricePerNight)
    if (base && offer && base > offer) {
      return Math.round(((base - offer) / base) * 100)
    }
    return 0
  })()

  const filtered = data?.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.roomNumber.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all {data?.length || 0} rooms</p>
        </div>
        <button onClick={openNew} className="btn-gold text-sm py-2">
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE", "RESERVED"].map((status) => {
          const count = data?.filter((r) => r.status === status).length || 0
          return (
            <div key={status} className="luxury-card p-4 text-center">
              <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{count}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[status]}`}>{status}</span>
            </div>
          )
        })}
      </div>

      {/* Room Cards Grid */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-white/5 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((room) => {
              const primaryImg = room.images?.find((i) => i.isPrimary) || room.images?.[0]
              const discount = room.basePrice && room.basePrice > room.pricePerNight
                ? Math.round(((room.basePrice - room.pricePerNight) / room.basePrice) * 100)
                : 0
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all hover:shadow-lg"
                >
                  {/* Room Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-white/5 overflow-hidden">
                    {primaryImg ? (
                      primaryImg.isVideo ? (
                        <video src={primaryImg.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={primaryImg.url} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[room.status]}`}>
                        {room.status}
                      </span>
                      {discount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                      #{room.roomNumber} · Floor {room.floor}
                    </div>

                    {/* Image count */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {room.images && room.images.length > 0 && (
                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> {room.images.filter((i) => !i.isVideo).length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-serif font-bold text-gray-900 dark:text-white">{room.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{room.roomType.replace(/_/g, " ")} · {room.bedType} Bed</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      {room.basePrice && room.basePrice > room.pricePerNight && (
                        <span className="text-sm text-gray-400 line-through">{formatCurrency(room.basePrice)}</span>
                      )}
                      <span className="text-lg font-bold text-gold-600 dark:text-gold-400">{formatCurrency(room.pricePerNight)}</span>
                      <span className="text-xs text-gray-400">/night</span>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{room.maxAdults}A/{room.maxChildren}C</span>
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{room.bedType}</span>
                      {room.size && <span>{room.size}m²</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                      <button onClick={() => openEdit(room)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-lg text-xs font-medium hover:bg-gold-100 dark:hover:bg-gold-500/20 transition-colors">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(room.id) }}
                        className="py-2 px-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditRoom(null) } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 dark:border-white/10 my-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                  {editRoom ? `Edit Room #${editRoom.roomNumber}` : "Add New Room(s)"}
                </h2>
                <button onClick={() => { setShowModal(false); setEditRoom(null) }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs (for edit mode) */}
              {editRoom && (
                <div className="flex border-b border-gray-100 dark:border-white/10 px-6">
                  {(["details", "media"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMediaTab(tab)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                        mediaTab === tab
                          ? "border-gold-500 text-gold-600 dark:text-gold-400"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab === "media" ? "Photos & Videos" : "Room Details"}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab: Details */}
              {mediaTab === "details" && (
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                  {/* Room Numbers */}
                  {!editRoom && (
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">
                        Room Numbers <span className="text-gray-400 normal-case">(comma separated for bulk add)</span>
                      </label>
                      <input
                        value={form.roomNumbers}
                        onChange={(e) => setForm({ ...form, roomNumbers: e.target.value })}
                        placeholder="e.g. 101, 102, 103"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                        required
                      />
                      {form.roomNumbers && (
                        <p className="text-xs text-gold-500 mt-1.5 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {form.roomNumbers.split(",").filter((n) => n.trim()).length} room(s) will be created
                        </p>
                      )}
                    </div>
                  )}

                  {/* Name & Type row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Room Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Deluxe King Room"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Room Type</label>
                      <select
                        value={form.roomType}
                        onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {ROOM_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Bed & Floor */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Bed Type</label>
                      <select
                        value={form.bedType}
                        onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {BED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Floor</label>
                      <input
                        type="number"
                        value={form.floor}
                        onChange={(e) => setForm({ ...form, floor: e.target.value })}
                        placeholder="Auto from room #"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Size (m²)</label>
                      <input
                        type="number"
                        value={form.size}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                        placeholder="e.g. 35"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gradient-to-r from-gold-50/50 to-amber-50/50 dark:from-gold-500/5 dark:to-amber-500/5 rounded-xl p-5 border border-gold-200/50 dark:border-gold-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <IndianRupee className="w-4 h-4 text-gold-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Pricing</h3>
                      {discountPercent > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                          <Percent className="w-3 h-3" /> {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                          Real Price (MRP) <Tag className="w-3 h-3 inline ml-1" />
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={form.basePrice}
                            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                            placeholder="Original price"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent text-sm focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                          Offer Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={form.pricePerNight}
                            onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                            placeholder="Selling price"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent text-sm focus:outline-none focus:border-gold-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Weekend Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={form.weekendPrice}
                            onChange={(e) => setForm({ ...form, weekendPrice: e.target.value })}
                            placeholder="Weekend price"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent text-sm focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Festival Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={form.festivalPrice}
                            onChange={(e) => setForm({ ...form, festivalPrice: e.target.value })}
                            placeholder="Festival price"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent text-sm focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Max Adults</label>
                      <input
                        type="number" min="1"
                        value={form.maxAdults}
                        onChange={(e) => setForm({ ...form, maxAdults: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Max Children</label>
                      <input
                        type="number" min="0"
                        value={form.maxChildren}
                        onChange={(e) => setForm({ ...form, maxChildren: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Bathrooms</label>
                      <input
                        type="number" min="1"
                        value={form.bathrooms}
                        onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">Room Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {amenities?.map((amenity) => {
                        const isSelected = form.amenityIds.includes(amenity.id)
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => {
                              setForm({
                                ...form,
                                amenityIds: isSelected
                                  ? form.amenityIds.filter((id) => id !== amenity.id)
                                  : [...form.amenityIds, amenity.id],
                              })
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
                              isSelected
                                ? "bg-gold-500 text-white border-gold-500 shadow-gold"
                                : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gold-500/50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {amenity.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quick boolean toggles */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">Quick Features</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["hasWifi", "hasAC", "hasTV", "hasBalcony", "hasBreakfast", "hasRoomService"] as const).map((key) => {
                        const labels: Record<string, string> = {
                          hasWifi: "WiFi", hasAC: "AC", hasTV: "TV",
                          hasBalcony: "Balcony", hasBreakfast: "Breakfast", hasRoomService: "Room Service",
                        }
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setForm({ ...form, [key]: !form[key] })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                              form[key]
                                ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10"
                            }`}
                          >
                            {form[key] ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            {labels[key]}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* About Room */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">About Room</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      placeholder="Describe the room, its features, ambiance, and what makes it special..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 resize-none"
                      required
                    />
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1.5">Cancellation Policy</label>
                    <textarea
                      value={form.cancelPolicy}
                      onChange={(e) => setForm({ ...form, cancelPolicy: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 btn-gold py-3 justify-center disabled:opacity-50"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : editRoom ? "Update Room" : `Create ${form.roomNumbers.split(",").filter((n) => n.trim()).length || 1} Room(s)`}
                    </button>
                    <button type="button" onClick={() => { setShowModal(false); setEditRoom(null) }} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Tab: Media */}
              {mediaTab === "media" && editRoom && (
                <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                  {/* Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-gold-500 transition-colors group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    {uploadingFiles ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gold-500 font-medium">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gold-50 dark:bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-100 dark:group-hover:bg-gold-500/20 transition-colors">
                          <Upload className="w-7 h-7 text-gold-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Click to upload photos & videos</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP, MP4 • Max 50MB per file • Select multiple</p>
                      </>
                    )}
                  </div>

                  {/* Existing Media Grid */}
                  {editRoom.images && editRoom.images.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Current Media ({editRoom.images.length} files)
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {editRoom.images.map((img) => (
                          <div key={img.id} className="relative group/img rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                            {img.isVideo ? (
                              <video src={img.url} className="w-full h-32 object-cover" muted />
                            ) : (
                              <img src={img.url} alt="" className="w-full h-32 object-cover" />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => setPrimaryMutation.mutate({ roomId: editRoom.id, imageId: img.id })}
                                className={`p-2 rounded-lg transition-colors ${
                                  img.isPrimary
                                    ? "bg-gold-500 text-white"
                                    : "bg-white/20 text-white hover:bg-gold-500"
                                }`}
                                title="Set as primary"
                              >
                                <Crown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteImageMutation.mutate({ roomId: editRoom.id, imageId: img.id })}
                                className="p-2 rounded-lg bg-white/20 text-white hover:bg-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Badges */}
                            {img.isPrimary && (
                              <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">PRIMARY</div>
                            )}
                            {img.isVideo && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                <Video className="w-2.5 h-2.5" /> VIDEO
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No media uploaded yet</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
