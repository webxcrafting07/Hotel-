"use client"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { User, Phone, Mail, Lock, Award, Copy, Check } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import api from "@/lib/api"
import toast from "react-hot-toast"

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] })

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const inp = "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone || "" },
  })

  const { register: regPass, handleSubmit: handlePass, formState: { errors: passErrors }, reset: resetPass } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  const updateMutation = useMutation({
    mutationFn: (data: ProfileData) => api.put("/users/profile", data),
    onSuccess: (res) => { updateUser(res.data.data); toast.success("Profile updated!") },
  })

  const passMutation = useMutation({
    mutationFn: (data: PasswordData) => api.put("/users/change-password", data),
    onSuccess: () => { toast.success("Password changed!"); resetPass() },
    onError: () => toast.error("Current password is incorrect"),
  })

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Referral code copied!")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Loyalty & Referral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="luxury-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{user?.loyaltyPoints}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loyalty Points</p>
            </div>
          </div>
        </div>
        <div className="luxury-card p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-gold-500">{user?.referralCode || "—"}</span>
            <button onClick={copyReferral} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Share and earn 100 points per referral</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="luxury-card p-6">
        <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Personal Information</h2>
        <form onSubmit={handleProfile(updateMutation.mutate as any)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...regProfile("firstName")} className={inp} />
              </div>
              {profileErrors.firstName && <p className="mt-1 text-xs text-red-500">{profileErrors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...regProfile("lastName")} className={inp} />
              </div>
              {profileErrors.lastName && <p className="mt-1 text-xs text-red-500">{profileErrors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={user?.email} disabled className={`${inp} opacity-60 cursor-not-allowed`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...regProfile("phone")} type="tel" className={inp} />
            </div>
          </div>
          <button type="submit" disabled={updateMutation.isPending} className="btn-gold py-2.5 disabled:opacity-50">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Form */}
      <div className="luxury-card p-6">
        <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-5">Change Password</h2>
        <form onSubmit={handlePass(passMutation.mutate as any)} className="space-y-4">
          {[
            { label: "Current Password", name: "currentPassword", err: passErrors.currentPassword },
            { label: "New Password", name: "newPassword", err: passErrors.newPassword },
            { label: "Confirm New Password", name: "confirmPassword", err: passErrors.confirmPassword },
          ].map(({ label, name, err }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...regPass(name as any)} type="password" className={inp} />
              </div>
              {err && <p className="mt-1 text-xs text-red-500">{err.message}</p>}
            </div>
          ))}
          <button type="submit" disabled={passMutation.isPending} className="btn-gold py-2.5 disabled:opacity-50">
            {passMutation.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
