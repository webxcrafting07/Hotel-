"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import api from "@/lib/api"
import { formatDate, formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
}

export default function AdminSpaPage() {
  const qc = useQueryClient()
  const { data: appointments } = useQuery({
    queryKey: ["admin-spa-appointments"],
    queryFn: async () => {
      const res = await api.get("/spa/appointments")
      return res.data.data
    },
  })

  const { data: services } = useQuery({
    queryKey: ["spa-services"],
    queryFn: async () => {
      const res = await api.get("/spa/services")
      return res.data.data
    },
  })

  const todayAppts = appointments?.filter((a: any) => {
    const today = new Date().toDateString()
    return new Date(a.date).toDateString() === today
  }) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Spa Management</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Appointments and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="luxury-card p-5 text-center">
          <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{appointments?.length || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total Appointments</p>
        </div>
        <div className="luxury-card p-5 text-center">
          <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{todayAppts.length}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Today's Appointments</p>
        </div>
        <div className="luxury-card p-5 text-center">
          <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{services?.length || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active Services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="luxury-card p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Recent Appointments</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {appointments?.slice(0,10).map((appt: any) => (
              <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{appt.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{appt.service?.name} · {formatDate(appt.date)} at {appt.time}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[appt.status]}`}>{appt.status}</span>
                  <p className="text-xs text-gold-500 font-semibold mt-1">{formatCurrency(appt.amount)}</p>
                </div>
              </div>
            ))}
            {!appointments?.length && <p className="text-center text-gray-400 py-6">No appointments yet</p>}
          </div>
        </div>

        {/* Services */}
        <div className="luxury-card p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Spa Services</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {services?.map((svc: any) => (
              <div key={svc.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{svc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />{svc.duration} min
                  </p>
                </div>
                <span className="font-semibold text-gold-600 dark:text-gold-400 text-sm">{formatCurrency(svc.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
