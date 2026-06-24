"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, CheckCircle } from "lucide-react"
import api from "@/lib/api"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  VERIFIED: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
}

export default function HousekeepingPage() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [showModal, setShowModal] = useState(false)

  const { data } = useQuery({
    queryKey: ["housekeeping-tasks", statusFilter],
    queryFn: async () => {
      const params: any = {}
      if (statusFilter !== "ALL") params.status = statusFilter
      const res = await api.get("/housekeeping", { params })
      return res.data.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/housekeeping/${id}/status`, { status }),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["housekeeping-tasks"] }) },
  })

  const tasks = data || []
  const counts = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, VERIFIED: 0 }
  tasks.forEach((t: any) => { if (t.status in counts) counts[t.status as keyof typeof counts]++ })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Housekeeping</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Daily cleaning & maintenance schedule</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold text-sm py-2">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="luxury-card p-4 text-center">
            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{count}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[status]}`}>{status.replace("_"," ")}</span>
          </div>
        ))}
      </div>

      <div className="luxury-card p-6">
        <div className="flex gap-2 mb-5 flex-wrap">
          {["ALL","PENDING","IN_PROGRESS","COMPLETED","VERIFIED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-gold-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"}`}>
              {s.replace("_"," ")}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>No tasks found</p>
            </div>
          ) : tasks.map((task: any, i: number) => (
            <motion.div key={task.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gold-500/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    Room {task.room?.roomNumber} — {task.taskType}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                  {task.priority === "HIGH" && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">HIGH</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {task.staff && <span>Assigned: {task.staff.user?.firstName} {task.staff.user?.lastName}</span>}
                  {task.scheduledAt && <span>Scheduled: {formatDate(task.scheduledAt)}</span>}
                  {task.completedAt && <span>Done: {formatDate(task.completedAt)}</span>}
                  {task.notes && <span className="text-gray-500">"{task.notes}"</span>}
                </div>
              </div>
              <select
                value={task.status}
                onChange={(e) => updateMutation.mutate({ id:task.id, status:e.target.value })}
                className={`text-xs px-2 py-1 rounded-lg border-0 cursor-pointer font-medium ${STATUS_COLORS[task.status]}`}>
                {["PENDING","IN_PROGRESS","COMPLETED","VERIFIED"].map(s => (
                  <option key={s} value={s}>{s.replace("_"," ")}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && <CreateTaskModal onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); qc.invalidateQueries({ queryKey: ["housekeeping-tasks"] }) }} />}
    </div>
  )
}

function CreateTaskModal({ onClose, onSuccess }: { onClose:()=>void; onSuccess:()=>void }) {
  const { data: rooms } = useQuery({
    queryKey: ["rooms-list"],
    queryFn: async () => { const res = await api.get("/rooms?limit=50"); return res.data.data },
  })
  const [form, setForm] = useState({ roomId:"", taskType:"CLEANING", priority:"NORMAL", notes:"" })
  const [loading, setLoading] = useState(false)
  const inp = "w-full px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      await api.post("/housekeeping", form)
      toast.success("Task created!")
      onSuccess()
    } catch { toast.error("Failed") }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-luxury-dark rounded-2xl shadow-luxury w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Add Housekeeping Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Room*</label>
            <select className={`${inp} bg-white dark:bg-gray-900`} value={form.roomId} onChange={(e) => setForm({...form, roomId:e.target.value})} required>
              <option value="">Select Room</option>
              {rooms?.map((r: any) => <option key={r.id} value={r.id}>Room {r.roomNumber} — {r.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Task Type</label>
              <select className={`${inp} bg-white dark:bg-gray-900`} value={form.taskType} onChange={(e) => setForm({...form, taskType:e.target.value})}>
                {["CLEANING","MAINTENANCE","LAUNDRY"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Priority</label>
              <select className={`${inp} bg-white dark:bg-gray-900`} value={form.priority} onChange={(e) => setForm({...form, priority:e.target.value})}>
                {["LOW","NORMAL","HIGH","URGENT"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Notes</label>
            <textarea className={`${inp} resize-none`} rows={3} value={form.notes} onChange={(e) => setForm({...form, notes:e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-gold justify-center py-2.5 disabled:opacity-50">
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
