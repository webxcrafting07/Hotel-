"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Check } from "lucide-react"
import api from "@/lib/api"
import { Notification } from "@/types"
import { formatDate } from "@/lib/utils"

const ICONS = {
  SUCCESS: CheckCircle,
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: XCircle,
}
const COLORS = {
  SUCCESS: "text-green-500 bg-green-50 dark:bg-green-500/10",
  INFO: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  WARNING: "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
  ERROR: "text-red-500 bg-red-50 dark:bg-red-500/10",
}

export default function NotificationsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/users/notifications")
      return res.data.data as Notification[]
    },
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  })

  const unread = data?.filter((n) => !n.isRead).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={() => data?.filter(n => !n.isRead).forEach(n => markReadMutation.mutate(n.id))}
            className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-600">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="luxury-card p-5 animate-pulse">
              <div className="flex gap-4"><div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" /><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /></div></div>
            </div>
          ))}
        </div>
      ) : !data?.length ? (
        <div className="luxury-card p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((notif, i) => {
            const Icon = ICONS[notif.type] || Info
            const colors = COLORS[notif.type] || COLORS.INFO
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.04 }}
                className={`luxury-card p-5 cursor-pointer transition-all ${!notif.isRead ? "border-gold-500/30 bg-gold-50/30 dark:bg-gold-500/5" : ""}`}
                onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}>
                <div className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm ${!notif.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(notif.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
