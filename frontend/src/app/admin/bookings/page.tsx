"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, CheckCircle, XCircle, LogIn, LogOut, Eye, Filter, FileText } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { Booking } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  CHECKED_IN: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  CHECKED_OUT: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  NO_SHOW: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
}

export default function AdminBookingsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  
  // Check-In Modal State
  const [checkInModal, setCheckInModal] = useState<{ isOpen: boolean; bookingId: string | null; defaultRoomId: string | null }>({ isOpen: false, bookingId: null, defaultRoomId: null })
  const [selectedRoomId, setSelectedRoomId] = useState<string>("")
  const [idProofType, setIdProofType] = useState("AADHAR")
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  const [guestAddress, setGuestAddress] = useState("")
  const [checkInTime, setCheckInTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check-Out Modal State
  const [checkOutModal, setCheckOutModal] = useState<{ isOpen: boolean; bookingId: string | null }>({ isOpen: false, bookingId: null })
  const [checkOutTime, setCheckOutTime] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", page, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = { page: page.toString(), limit: "20" }
      if (statusFilter !== "ALL") params.status = statusFilter
      const res = await api.get("/bookings", { params })
      return res.data
    },
  })

  const { data: roomsData } = useQuery({
    queryKey: ["admin-rooms-all"],
    queryFn: async () => {
      const res = await api.get("/rooms", { params: { limit: "100" } })
      return res.data?.data || []
    },
  })

  const checkInMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const id = data.get("bookingId") as string
      return api.patch(`/bookings/${id}/check-in`, data, { headers: { "Content-Type": "multipart/form-data" } })
    },
    onSuccess: () => { 
      toast.success("Checked in successfully!")
      qc.invalidateQueries({ queryKey: ["admin-bookings"] })
      setCheckInModal({ isOpen: false, bookingId: null, defaultRoomId: null })
      setIdProofFile(null)
      setGuestAddress("")
    },
    onError: () => toast.error("Failed to check in"),
    onSettled: () => setIsSubmitting(false)
  })

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkInModal.bookingId) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("bookingId", checkInModal.bookingId)
    formData.append("idProofType", idProofType)
    formData.append("guestAddress", guestAddress)
    if (checkInTime) formData.append("checkInTime", new Date(checkInTime).toISOString())
    if (selectedRoomId) {
      formData.append("roomId", selectedRoomId)
    }
    if (idProofFile) {
      formData.append("idProof", idProofFile)
    }

    checkInMutation.mutate(formData)
  }
  const checkOutMutation = useMutation({
    mutationFn: async ({ id, checkOutTime }: { id: string, checkOutTime: string }) => {
      const payload = checkOutTime ? { checkOutTime: new Date(checkOutTime).toISOString() } : {}
      return api.patch(`/bookings/${id}/check-out`, payload)
    },
    onSuccess: () => { 
      toast.success("Checked out!"); 
      qc.invalidateQueries({ queryKey: ["admin-bookings"] })
      setCheckOutModal({ isOpen: false, bookingId: null })
    },
  })

  const handleCheckOutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkOutModal.bookingId) return
    checkOutMutation.mutate({ id: checkOutModal.bookingId, checkOutTime })
  }
  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/bookings/${id}/cancel`, { reason: "Cancelled by admin" }),
    onSuccess: () => { toast.success("Booking cancelled"); qc.invalidateQueries({ queryKey: ["admin-bookings"] }) },
  })

  const bookings: Booking[] = data?.data || []
  const filtered = bookings.filter((b) =>
    b.bookingNumber.includes(search) ||
    b.guestName?.toLowerCase().includes(search.toLowerCase()) ||
    b.guestEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total: {data?.pagination?.total || 0} bookings</p>
        </div>
        <Link href="/admin/bookings/new" className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors text-sm font-medium">
          + Walk-in Booking
        </Link>
      </div>

      <div className="luxury-card p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by booking # or guest..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL","PENDING","CONFIRMED","CHECKED_IN","CHECKED_OUT","CANCELLED"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-gold-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gold-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-white/5">
                {["Booking #","Guest","Room","Check-in","Check-out","Amount","Status","Actions"].map((h) => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {isLoading ? Array(10).fill(0).map((_, i) => (
                <tr key={i}>{Array(8).fill(0).map((_, j) => (
                  <td key={j} className="py-3 pr-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
                ))}</tr>
              )) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group">
                  <td className="py-3 pr-4 font-mono text-xs text-gold-600 dark:text-gold-400 font-semibold">{b.bookingNumber}</td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900 dark:text-white text-xs">{b.guestName}</p>
                    <p className="text-gray-400 text-xs">{b.guestEmail}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-600 dark:text-gray-400">{b.room?.name}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600 dark:text-gray-400">{formatDate(b.checkIn)}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600 dark:text-gray-400">{formatDate(b.checkOut)}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{formatCurrency(b.totalAmount)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {b.status === "CONFIRMED" && (
                        <button onClick={() => { setCheckInModal({ isOpen: true, bookingId: b.id, defaultRoomId: b.roomId }); setSelectedRoomId(b.roomId); setCheckInTime(new Date().toISOString().slice(0, 16)); }}
                          className="p-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 hover:bg-green-100 transition-colors" title="Check In">
                          <LogIn className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <button onClick={() => { setCheckOutModal({ isOpen: true, bookingId: b.id }); setCheckOutTime(new Date().toISOString().slice(0, 16)); }}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-100 transition-colors" title="Check Out">
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {["PENDING","CONFIRMED"].includes(b.status) && (
                        <button onClick={() => { if(confirm("Cancel booking?")) cancelMutation.mutate(b.id) }}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 transition-colors" title="Cancel">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Link href={`/admin/bookings/${b.id}`} className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 hover:bg-gray-100 transition-colors" title="View Details">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {b.invoice && (
                        <Link href={`/admin/bookings/${b.id}/invoice`} className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 hover:bg-gray-100 transition-colors" title="View Bill">
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.pagination && (
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100 dark:border-white/5">
            <p className="text-sm text-gray-500">
              Showing {((page-1)*20)+1}–{Math.min(page*20, data.pagination.total)} of {data.pagination.total}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-40 hover:border-gold-500 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(data.pagination.pages, p+1))} disabled={page >= data.pagination.pages}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-40 hover:border-gold-500 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      {checkInModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-luxury-dark rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Check-In Guest</h2>
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Room (Booked)</label>
                <select value={selectedRoomId} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-white/10 text-gray-500 cursor-not-allowed">
                  <option value="">Select Room</option>
                  {roomsData?.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.roomNumber} - {r.name} ({r.roomType})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Room cannot be changed at check-in.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID Proof Type</label>
                <select value={idProofType} onChange={(e) => setIdProofType(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-white/10">
                  <option value="AADHAR">Aadhar Card</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Upload ID Scan (Optional)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setIdProofFile(e.target.files?.[0] || null)} className="w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Guest Address</label>
                <textarea value={guestAddress} onChange={(e) => setGuestAddress(e.target.value)} required rows={2} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" placeholder="Full residential address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-in Date & Time</label>
                <input type="datetime-local" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-white/10" />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t dark:border-white/10">
                <button type="button" onClick={() => setCheckInModal({ isOpen: false, bookingId: null, defaultRoomId: null })} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
                  {isSubmitting ? "Checking In..." : "Confirm Check-In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-Out Modal */}
      {checkOutModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-luxury-dark rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Check-Out Guest</h2>
            <form onSubmit={handleCheckOutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-out Date & Time</label>
                <input type="datetime-local" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-white/10" />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t dark:border-white/10">
                <button type="button" onClick={() => setCheckOutModal({ isOpen: false, bookingId: null })} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                  Confirm Check-Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
