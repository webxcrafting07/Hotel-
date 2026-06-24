export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: 'SUPER_ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'HOUSEKEEPING' | 'ACCOUNTANT' | 'STAFF' | 'CUSTOMER'
  loyaltyPoints: number
  referralCode?: string
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface Room {
  id: string
  roomNumber: string
  floor: number
  roomType: 'STANDARD' | 'DELUXE' | 'SUPERIOR' | 'JUNIOR_SUITE' | 'SUITE' | 'PRESIDENTIAL_SUITE'
  name: string
  description: string
  basePrice?: number
  pricePerNight: number
  weekendPrice: number
  festivalPrice: number
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING' | 'RESERVED'
  maxAdults: number
  maxChildren: number
  maxOccupancy: number
  bedType: 'SINGLE' | 'DOUBLE' | 'QUEEN' | 'KING' | 'TWIN'
  bathrooms: number
  hasBalcony: boolean
  hasWifi: boolean
  hasAC: boolean
  hasBreakfast: boolean
  hasTV: boolean
  hasRoomService: boolean
  size?: number
  view?: string
  cancelPolicy?: string
  virtualTourUrl?: string
  images: RoomImage[]
  amenities: { amenity: Amenity }[]
  avgRating?: number
  reviewCount?: number
  reviews?: Review[]
}

export interface RoomImage {
  id: string
  url: string
  alt?: string
  isVideo?: boolean
  isPrimary: boolean
}

export interface Amenity {
  id: string
  name: string
  icon?: string
  category?: string
}

export interface Booking {
  id: string
  bookingNumber: string
  userId: string
  roomId: string
  checkIn: string
  checkOut: string
  nights: number
  adults: number
  children: number
  extraBeds: number
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW'
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED'
  roomPrice: number
  extraBedPrice: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAmount: number
  specialRequests?: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  guestAddress?: string
  idProofUrl?: string
  idProofType?: string
  isOffline?: boolean
  qrCode?: string
  room?: Room
  user?: User
  payments?: Payment[]
  invoice?: Invoice
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  method: string
  status: string
  transactionId?: string
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  total: number
  pdfUrl?: string
}

export interface Review {
  id: string
  userId: string
  roomId?: string
  rating: number
  title?: string
  comment: string
  images: string[]
  isVerified: boolean
  adminReply?: string
  user?: { firstName: string; lastName: string; avatar?: string }
  createdAt: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  category?: string
  tags: string[]
  isPublished: boolean
  publishedAt?: string
  viewCount: number
  author?: { firstName: string; lastName: string; avatar?: string }
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  isRead: boolean
  link?: string
  createdAt: string
}

export interface Coupon {
  code: string
  description?: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  maxDiscount?: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
