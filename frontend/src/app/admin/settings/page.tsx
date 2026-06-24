"use client"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Save, Settings, Mail, CreditCard, Globe, Shield } from "lucide-react"
import api from "@/lib/api"
import toast from "react-hot-toast"

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "email", label: "Email", icon: Mail },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "security", label: "Security & Password", icon: Shield },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    site_name: "Hotel The Anand",
    site_tagline: "Where Luxury Meets Comfort",
    contact_phone: "+91-9296985454",
    contact_email: "hoteltheanand5454@gmail.com",
    contact_address: "Gandhi Labour Foundation Road, Near Silicon Hotel, Puri, Odisha - 752001",
    check_in_time: "14:00",
    check_out_time: "11:00",
    currency: "INR",
    gst_number: "21ABCDE1234F1Z5",
    meta_title: "Hotel The Anand | Luxury Hotel in Puri, Odisha",
    meta_description: "Experience unmatched luxury at Hotel The Anand, Puri.",
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    razorpay_key_id: "",
    stripe_publishable_key: "",
  })

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => api.put("/users/change-password", data),
    onSuccess: () => {
      toast.success("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to change password")
  })

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!")
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
  }

  const saveMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const entries = Object.entries(data)
      await Promise.all(entries.map(([key, value]) =>
        api.post("/settings", { key, value }).catch(() => {})
      ))
    },
    onSuccess: () => toast.success("Settings saved!"),
    onError: () => toast.error("Failed to save settings"),
  })

  const inp = "w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"
  const label = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"

  const renderTab = () => {
    switch(activeTab) {
      case "general": return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div><label className={label}>Hotel Name</label><input className={inp} value={settings.site_name} onChange={e => setSettings({...settings, site_name:e.target.value})} /></div>
            <div><label className={label}>Tagline</label><input className={inp} value={settings.site_tagline} onChange={e => setSettings({...settings, site_tagline:e.target.value})} /></div>
          </div>
          <div><label className={label}>Contact Phone</label><input className={inp} value={settings.contact_phone} onChange={e => setSettings({...settings, contact_phone:e.target.value})} /></div>
          <div><label className={label}>Contact Email</label><input className={inp} type="email" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email:e.target.value})} /></div>
          <div><label className={label}>Address</label><textarea className={`${inp} resize-none`} rows={2} value={settings.contact_address} onChange={e => setSettings({...settings, contact_address:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-5">
            <div><label className={label}>Check-in Time</label><input className={inp} type="time" value={settings.check_in_time} onChange={e => setSettings({...settings, check_in_time:e.target.value})} /></div>
            <div><label className={label}>Check-out Time</label><input className={inp} type="time" value={settings.check_out_time} onChange={e => setSettings({...settings, check_out_time:e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div><label className={label}>Currency</label><input className={inp} value={settings.currency} onChange={e => setSettings({...settings, currency:e.target.value})} /></div>
            <div><label className={label}>GST Number</label><input className={inp} value={settings.gst_number} onChange={e => setSettings({...settings, gst_number:e.target.value})} /></div>
          </div>
        </div>
      )
      case "seo": return (
        <div className="space-y-5">
          <div><label className={label}>Meta Title</label><input className={inp} value={settings.meta_title} onChange={e => setSettings({...settings, meta_title:e.target.value})} /></div>
          <div><label className={label}>Meta Description</label><textarea className={`${inp} resize-none`} rows={3} value={settings.meta_description} onChange={e => setSettings({...settings, meta_description:e.target.value})} /></div>
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            Configure robots.txt, sitemap.xml and structured data through the deployment platform settings.
          </div>
        </div>
      )
      case "email": return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div><label className={label}>SMTP Host</label><input className={inp} value={settings.smtp_host} onChange={e => setSettings({...settings, smtp_host:e.target.value})} /></div>
            <div><label className={label}>SMTP Port</label><input className={inp} type="number" value={settings.smtp_port} onChange={e => setSettings({...settings, smtp_port:e.target.value})} /></div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
            SMTP credentials are stored in environment variables for security. Update them in your deployment platform.
          </div>
        </div>
      )
      case "payment": return (
        <div className="space-y-5">
          <div><label className={label}>Razorpay Key ID</label><input className={inp} value={settings.razorpay_key_id} onChange={e => setSettings({...settings, razorpay_key_id:e.target.value})} placeholder="rzp_live_..." /></div>
          <div><label className={label}>Stripe Publishable Key</label><input className={inp} value={settings.stripe_publishable_key} onChange={e => setSettings({...settings, stripe_publishable_key:e.target.value})} placeholder="pk_live_..." /></div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
            Payment secret keys must be stored in environment variables. Never expose secret keys in the frontend.
          </div>
        </div>
      )
      case "security": return (
        <div className="space-y-4">
          {[
            { label: "Rate Limiting", desc: "100 requests per 15 minutes per IP", enabled: true },
            { label: "CORS Protection", desc: "Only allow requests from configured origins", enabled: true },
            { label: "Helmet Security Headers", desc: "XSS, CSRF, and clickjacking protection", enabled: true },
            { label: "SQL Injection Protection", desc: "Parameterized queries via Prisma ORM", enabled: true },
            { label: "JWT Authentication", desc: "Access & refresh token pair with HTTP-only cookies", enabled: true },
            { label: "2FA Ready", desc: "Two-factor authentication infrastructure available", enabled: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.enabled ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"}`}>
                {item.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          ))}

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className={label}>Current Password</label>
                <input type="password" required className={inp} value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} />
              </div>
              <div>
                <label className={label}>New Password</label>
                <input type="password" required minLength={6} className={inp} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
              </div>
              <div>
                <label className={label}>Confirm New Password</label>
                <input type="password" required minLength={6} className={inp} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
              </div>
              <button type="submit" disabled={changePasswordMutation.isPending} className="px-4 py-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 text-sm font-medium">
                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure your hotel management system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="luxury-card p-4 h-fit">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === id ? "bg-gold-500 text-white shadow-gold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gold-500"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 luxury-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
              {TABS.find(t => t.id === activeTab)?.label} Settings
            </h2>
            <button onClick={() => saveMutation.mutate(settings)} disabled={saveMutation.isPending}
              className="btn-gold text-sm py-2 disabled:opacity-50">
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
