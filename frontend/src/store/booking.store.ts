import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingState {
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
  roomId: string | null
  setCheckIn: (date: Date | null) => void
  setCheckOut: (date: Date | null) => void
  setAdults: (count: number) => void
  setChildren: (count: number) => void
  setRoomId: (id: string | null) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      checkIn: null,
      checkOut: null,
      adults: 1,
      children: 0,
      roomId: null,
      setCheckIn: (date) => set({ checkIn: date }),
      setCheckOut: (date) => set({ checkOut: date }),
      setAdults: (count) => set({ adults: count }),
      setChildren: (count) => set({ children: count }),
      setRoomId: (id) => set({ roomId: id }),
      reset: () => set({ checkIn: null, checkOut: null, adults: 1, children: 0, roomId: null }),
    }),
    { name: 'hotel-booking' }
  )
)
