"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"
import { QrCode, ArrowRight, Search, XCircle, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth.store"

export default function QRScannerPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "MANAGER" && user.role !== "RECEPTIONIST")) {
      router.push("/dashboard")
      return
    }

    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    )

    scanner.render(
      (text) => {
        try {
          const data = JSON.parse(text)
          if (data.bookingNumber) {
            scanner.clear()
            setIsScanning(false)
            setScanResult(data)
            fetchBooking(data.bookingNumber)
          } else {
             toast.error("Invalid QR Code")
          }
        } catch (e) {
          toast.error("Invalid QR Code Format")
        }
      },
      (error) => {
        // Ignored, happens continuously
      }
    )

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e))
    }
  }, [isScanning, user, router])

  const fetchBooking = async (bookingNumber: string) => {
    setIsLoading(true)
    try {
      // Assuming we have an API to fetch by bookingNumber, but we might only have /api/bookings?search=...
      // Let's fetch all bookings and find the one. We might need a better API, but this works for now.
      const res = await api.get(`/bookings`)
      const found = res.data.data.find((b: any) => b.bookingNumber === bookingNumber)
      if (found) {
        setBookingData(found)
        toast.success(`Found Booking #${bookingNumber}`)
      } else {
        toast.error("Booking not found in system")
        setScanResult(null)
        setIsScanning(true)
      }
    } catch (error) {
      toast.error("Failed to fetch booking details")
      setScanResult(null)
      setIsScanning(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">QR Check-in Scanner</h1>
          <p className="text-gray-500 mt-1">Scan guest QR codes to quickly view details and check them in.</p>
        </div>
        {scanResult && (
          <button onClick={() => { setScanResult(null); setBookingData(null); setIsScanning(true); }} className="btn-gold px-4 py-2 text-sm">
            Scan Another
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {isScanning && (
          <div className="luxury-card overflow-hidden">
             <div id="reader" className="w-full"></div>
          </div>
        )}

        {isLoading && !isScanning && (
          <div className="luxury-card p-12 flex flex-col items-center justify-center">
             <div className="animate-spin w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full mb-4" />
             <p className="text-gray-500 font-medium">Fetching booking details...</p>
          </div>
        )}

        {bookingData && !isLoading && (
          <div className="luxury-card p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                 <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-serif text-center font-bold text-gray-900 dark:text-white mb-2">
              Booking #{bookingData.bookingNumber}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {bookingData.guestName} • {bookingData.room?.name || "Room"}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                 <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                 <p className="font-bold text-gray-900 dark:text-white">{bookingData.status}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                 <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
                 <p className="font-bold text-gray-900 dark:text-white">{bookingData.paymentStatus}</p>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/admin/bookings/${bookingData.id}`)}
              className="w-full btn-gold py-4 flex items-center justify-center gap-2 text-lg"
            >
              View Booking & Check In <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
