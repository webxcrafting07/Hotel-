"use client"
import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout"
import { Clock, Star, Sparkles } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

export default function SpaPage() {
  const [selectedService, setSelectedService] = useState<any>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", notes: "" })

  const { data: services } = useQuery({
    queryKey: ["spa-services"],
    queryFn: async () => {
      const res = await api.get("/spa/services")
      return res.data.data
    },
  })

  const bookMutation = useMutation({
    mutationFn: (data: any) => api.post("/spa/appointments", data),
    onSuccess: () => { toast.success("Spa appointment booked!"); setSelectedService(null); setForm({ name:"",email:"",phone:"",date:"",time:"",notes:"" }) },
    onError: () => toast.error("Failed to book appointment"),
  })

  const inp = "w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-sm focus:outline-none focus:border-gold-500 dark:text-white"

  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-gradient-luxury text-white text-center">
        <p className="text-gold-400 text-sm tracking-widest uppercase mb-3">Rejuvenate & Restore</p>
        <h1 className="font-serif text-5xl font-bold mb-4">Spa & Wellness</h1>
        <p className="text-white/70 max-w-xl mx-auto">Immerse yourself in a world of tranquility with our signature Ayurvedic and contemporary treatments.</p>
      </div>

      <section className="section-padding bg-gray-50 dark:bg-luxury-darker">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Treatments</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(services || []).map((service: any, i: number) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
                className="luxury-card p-6 group">
                <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors">
                  <Sparkles className="w-5 h-5 text-gold-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-500" />{service.duration} min</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(service.price)}</span>
                  </div>
                  <button onClick={() => setSelectedService(service)} className="btn-gold text-sm py-2 px-4">Book</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-luxury-dark rounded-2xl shadow-luxury w-full max-w-md p-6">
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-1">Book {selectedService.name}</h3>
            <p className="text-gold-500 text-sm mb-5">{formatCurrency(selectedService.price)} · {selectedService.duration} minutes</p>
            <div className="space-y-3">
              {[["name","Your Name","text"],["email","Email","email"],["phone","Phone","tel"],["date","Date","date"],["time","Preferred Time","time"]].map(([key, ph, type]) => (
                <input key={key} type={type} placeholder={ph} value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({...form, [key]: e.target.value})} className={inp} />
              ))}
              <textarea placeholder="Special requests..." rows={2} value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})} className={`${inp} resize-none`} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelectedService(null)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
              <button onClick={() => bookMutation.mutate({ ...form, serviceId: selectedService.id })}
                disabled={bookMutation.isPending} className="flex-1 btn-gold justify-center py-2.5 disabled:opacity-50">
                {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  )
}
