"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { User } from "@/types"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  MANAGER: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  RECEPTIONIST: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  HOUSEKEEPING: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  ACCOUNTANT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  STAFF: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  CUSTOMER: "bg-gold-100 text-gold-700 dark:bg-gold-500/20 dark:text-gold-400",
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "RECEPTIONIST"
  })

  const addStaffMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post("/users/staff", data),
    onSuccess: () => {
      toast.success("Staff member created successfully!")
      setAddModalOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", password: "", role: "RECEPTIONIST" })
      qc.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create staff"),
    onSettled: () => setIsSubmitting(false)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: (data: any) => {
      toast.success(data.data?.message || "User deleted")
      qc.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to delete user"),
  })

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    addStaffMutation.mutate(formData)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, roleFilter],
    queryFn: async () => {
      const params: Record<string, string> = { page: page.toString(), limit: "20" }
      if (roleFilter !== "ALL") params.role = roleFilter
      if (search) params.search = search
      const res = await api.get("/users/all", { params })
      return res.data
    },
  })

  const users: User[] = data?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Users & Staff</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total: {data?.pagination?.total || 0} users</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors text-sm font-medium">
          + Add Staff
        </button>
      </div>

      <div className="luxury-card p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL","SUPER_ADMIN","MANAGER","RECEPTIONIST","HOUSEKEEPING","CUSTOMER"].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === r ? "bg-gold-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"}`}>
                {r.replace("_"," ")}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-white/5">
                {["Name","Email","Phone","Role","Status","Joined","Actions"].map((h) => (
                  <th key={h} className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {isLoading ? Array(10).fill(0).map((_, i) => (
                <tr key={i}>{Array(6).fill(0).map((_, j) => (
                  <td key={j} className="py-3 pr-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td>
                ))}</tr>
              )) : users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-600 dark:text-gold-400">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">{user.email}</td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">{user.phone || "—"}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                      {user.role.replace("_"," ")}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`flex items-center gap-1 text-xs ${user.isActive !== false ? "text-green-500" : "text-red-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? "bg-green-500" : "bg-red-500"}`} />
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-luxury-dark rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-black/20 dark:border-white/10" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-white/10">
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HOUSEKEEPING">Housekeeping</option>
                  <option value="ACCOUNTANT">Accountant</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t dark:border-white/10">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl dark:hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 disabled:opacity-50">
                  {isSubmitting ? "Creating..." : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
