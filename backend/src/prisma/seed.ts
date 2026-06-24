import { PrismaClient, RoomType, BedType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create amenities
  const amenities = await Promise.all([
    prisma.amenity.upsert({ where: { name: 'Free WiFi' }, update: {}, create: { name: 'Free WiFi', icon: 'wifi', category: 'connectivity' } }),
    prisma.amenity.upsert({ where: { name: 'Air Conditioning' }, update: {}, create: { name: 'Air Conditioning', icon: 'thermometer', category: 'comfort' } }),
    prisma.amenity.upsert({ where: { name: 'Flat-screen TV' }, update: {}, create: { name: 'Flat-screen TV', icon: 'tv', category: 'entertainment' } }),
    prisma.amenity.upsert({ where: { name: 'Mini Bar' }, update: {}, create: { name: 'Mini Bar', icon: 'wine', category: 'food' } }),
    prisma.amenity.upsert({ where: { name: 'Room Service' }, update: {}, create: { name: 'Room Service', icon: 'bell', category: 'service' } }),
    prisma.amenity.upsert({ where: { name: 'Bathtub' }, update: {}, create: { name: 'Bathtub', icon: 'bath', category: 'bathroom' } }),
    prisma.amenity.upsert({ where: { name: 'Safe Locker' }, update: {}, create: { name: 'Safe Locker', icon: 'lock', category: 'security' } }),
    prisma.amenity.upsert({ where: { name: 'Ocean View' }, update: {}, create: { name: 'Ocean View', icon: 'eye', category: 'view' } }),
    prisma.amenity.upsert({ where: { name: 'Balcony' }, update: {}, create: { name: 'Balcony', icon: 'sun', category: 'outdoor' } }),
    prisma.amenity.upsert({ where: { name: 'Breakfast Included' }, update: {}, create: { name: 'Breakfast Included', icon: 'coffee', category: 'food' } }),
  ]);

  // Create 18 rooms
  const rooms = [
    { roomNumber: '101', floor: 1, roomType: 'STANDARD' as RoomType, name: 'Standard Room', pricePerNight: 2500, weekendPrice: 2800, festivalPrice: 3500, bedType: 'DOUBLE' as BedType, maxAdults: 2, maxChildren: 1, hasBalcony: false },
    { roomNumber: '102', floor: 1, roomType: 'STANDARD' as RoomType, name: 'Standard Room', pricePerNight: 2500, weekendPrice: 2800, festivalPrice: 3500, bedType: 'TWIN' as BedType, maxAdults: 2, maxChildren: 1, hasBalcony: false },
    { roomNumber: '103', floor: 1, roomType: 'DELUXE' as RoomType, name: 'Deluxe Room', pricePerNight: 3500, weekendPrice: 4000, festivalPrice: 5000, bedType: 'QUEEN' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '104', floor: 1, roomType: 'DELUXE' as RoomType, name: 'Deluxe Room with Garden View', pricePerNight: 3800, weekendPrice: 4200, festivalPrice: 5200, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '201', floor: 2, roomType: 'SUPERIOR' as RoomType, name: 'Superior Room', pricePerNight: 4500, weekendPrice: 5000, festivalPrice: 6500, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '202', floor: 2, roomType: 'SUPERIOR' as RoomType, name: 'Superior Room with Sea View', pricePerNight: 5000, weekendPrice: 5500, festivalPrice: 7000, bedType: 'KING' as BedType, maxAdults: 3, maxChildren: 2, hasBalcony: true },
    { roomNumber: '203', floor: 2, roomType: 'SUPERIOR' as RoomType, name: 'Superior Twin Room', pricePerNight: 4800, weekendPrice: 5300, festivalPrice: 6800, bedType: 'TWIN' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: false },
    { roomNumber: '204', floor: 2, roomType: 'DELUXE' as RoomType, name: 'Deluxe Double Room', pricePerNight: 4000, weekendPrice: 4500, festivalPrice: 5500, bedType: 'DOUBLE' as BedType, maxAdults: 2, maxChildren: 1, hasBalcony: true },
    { roomNumber: '301', floor: 3, roomType: 'JUNIOR_SUITE' as RoomType, name: 'Junior Suite', pricePerNight: 7000, weekendPrice: 8000, festivalPrice: 10000, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '302', floor: 3, roomType: 'JUNIOR_SUITE' as RoomType, name: 'Junior Suite with Jacuzzi', pricePerNight: 7500, weekendPrice: 8500, festivalPrice: 11000, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '303', floor: 3, roomType: 'SUPERIOR' as RoomType, name: 'Superior Deluxe Room', pricePerNight: 5500, weekendPrice: 6000, festivalPrice: 7500, bedType: 'KING' as BedType, maxAdults: 3, maxChildren: 2, hasBalcony: true },
    { roomNumber: '304', floor: 3, roomType: 'SUPERIOR' as RoomType, name: 'Superior Family Room', pricePerNight: 5800, weekendPrice: 6500, festivalPrice: 8000, bedType: 'QUEEN' as BedType, maxAdults: 4, maxChildren: 2, hasBalcony: true },
    { roomNumber: '401', floor: 4, roomType: 'SUITE' as RoomType, name: 'Executive Suite', pricePerNight: 10000, weekendPrice: 12000, festivalPrice: 15000, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '402', floor: 4, roomType: 'SUITE' as RoomType, name: 'Luxury Suite with Sea View', pricePerNight: 12000, weekendPrice: 14000, festivalPrice: 18000, bedType: 'KING' as BedType, maxAdults: 3, maxChildren: 2, hasBalcony: true },
    { roomNumber: '403', floor: 4, roomType: 'SUITE' as RoomType, name: 'Honeymoon Suite', pricePerNight: 13000, weekendPrice: 15000, festivalPrice: 19000, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 0, hasBalcony: true },
    { roomNumber: '404', floor: 4, roomType: 'JUNIOR_SUITE' as RoomType, name: 'Deluxe Junior Suite', pricePerNight: 8000, weekendPrice: 9000, festivalPrice: 12000, bedType: 'KING' as BedType, maxAdults: 2, maxChildren: 2, hasBalcony: true },
    { roomNumber: '501', floor: 5, roomType: 'PRESIDENTIAL_SUITE' as RoomType, name: 'Presidential Suite', pricePerNight: 25000, weekendPrice: 30000, festivalPrice: 40000, bedType: 'KING' as BedType, maxAdults: 4, maxChildren: 2, hasBalcony: true },
    { roomNumber: '502', floor: 5, roomType: 'SUITE' as RoomType, name: 'Penthouse Suite', pricePerNight: 18000, weekendPrice: 22000, festivalPrice: 30000, bedType: 'KING' as BedType, maxAdults: 4, maxChildren: 2, hasBalcony: true },
  ];

  for (const roomData of rooms) {
    const room = await prisma.room.upsert({
      where: { roomNumber: roomData.roomNumber },
      update: {},
      create: {
        ...roomData,
        description: `Experience luxury and comfort in our beautifully appointed ${roomData.name}. Featuring elegant decor, modern amenities, and exceptional service that defines the Hotel The Anand experience.`,
        cancelPolicy: 'Free cancellation up to 24 hours before check-in. 50% charge for cancellation within 24 hours.',
        hasWifi: true,
        hasAC: true,
        hasTV: true,
        hasRoomService: true,
        hasBreakfast: roomData.roomType !== 'STANDARD',
        bathrooms: roomData.roomType === 'PRESIDENTIAL_SUITE' || roomData.roomType === 'SUITE' ? 2 : 1,
        size: roomData.roomType === 'STANDARD' ? 25 :
              roomData.roomType === 'DELUXE' ? 35 :
              roomData.roomType === 'SUPERIOR' ? 45 :
              roomData.roomType === 'JUNIOR_SUITE' ? 65 :
              roomData.roomType === 'SUITE' ? 90 : 150,
        maxOccupancy: roomData.maxAdults + roomData.maxChildren,
      },
    });

    // Add amenities to room
    const amenityIds = amenities.map(a => a.id).slice(0, Math.min(6, amenities.length));
    for (const amenityId of amenityIds) {
      await prisma.roomAmenity.upsert({
        where: { roomId_amenityId: { roomId: room.id, amenityId } },
        update: {},
        create: { roomId: room.id, amenityId },
      });
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@hotelanand.com' },
    update: {},
    create: {
      email: 'admin@hotelanand.com',
      password: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  });

  // Create receptionist
  const receptionistPassword = await bcrypt.hash('Receptionist@123', 12);
  await prisma.user.upsert({
    where: { email: 'reception@hotelanand.com' },
    update: {},
    create: {
      email: 'reception@hotelanand.com',
      password: receptionistPassword,
      firstName: 'Hotel',
      lastName: 'Reception',
      role: 'RECEPTIONIST',
      isEmailVerified: true,
    },
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'CUSTOMER',
      isEmailVerified: true,
      phone: '+91-9876543210',
    },
  });

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      description: 'Welcome discount - 20% off on first booking',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxDiscount: 2000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE500' },
    update: {},
    create: {
      code: 'SAVE500',
      description: 'Flat ₹500 off on bookings above ₹5000',
      discountType: 'FIXED',
      discountValue: 500,
      minBookingAmount: 5000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      usageLimit: 50,
    },
  });

  // Create spa services
  const spaServices = [
    { name: 'Ayurvedic Massage', description: 'Traditional Indian healing massage with herbal oils', duration: 90, price: 2500, category: 'massage' },
    { name: 'Swedish Massage', description: 'Classic relaxation massage', duration: 60, price: 2000, category: 'massage' },
    { name: 'Facial Treatment', description: 'Deep cleansing luxury facial', duration: 60, price: 1800, category: 'facial' },
    { name: 'Body Scrub & Wrap', description: 'Exfoliating body treatment', duration: 75, price: 2200, category: 'body' },
    { name: 'Hot Stone Therapy', description: 'Volcanic stone massage therapy', duration: 90, price: 3000, category: 'massage' },
    { name: 'Couple Spa', description: 'Romantic spa experience for two', duration: 120, price: 5500, category: 'couple' },
  ];

  for (const service of spaServices) {
    await prisma.spaService.upsert({
      where: { id: service.name },
      update: {},
      create: service,
    }).catch(() => prisma.spaService.create({ data: service }));
  }

  // Create sample packages
  const packages = [
    {
      name: 'Romantic Getaway',
      description: 'Perfect for couples seeking a romantic retreat. Includes spa, candle-lit dinner, and room decorated with flowers.',
      price: 25000,
      duration: 2,
      includes: ['Deluxe Room', 'Couple Spa', 'Candle-lit Dinner', 'Flower Decoration', 'Champagne', 'Late Checkout'],
    },
    {
      name: 'Family Fun Package',
      description: 'Create lasting memories with your family. Includes activities for kids and relaxation for adults.',
      price: 18000,
      duration: 3,
      includes: ['Family Suite', 'Breakfast', 'Kids Activities', 'Pool Access', 'City Tour'],
    },
    {
      name: 'Business Traveler',
      description: 'Stay productive with our business-focused package including meeting facilities and express services.',
      price: 15000,
      duration: 2,
      includes: ['Superior Room', 'Breakfast', 'Airport Transfer', 'Meeting Room (2hr)', 'Express Laundry'],
    },
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg }).catch(() => {});
  }

  // Website settings
  const settings = [
    { key: 'site_name', value: 'Hotel The Anand', type: 'text', group: 'general' },
    { key: 'site_tagline', value: 'Where Luxury Meets Comfort', type: 'text', group: 'general' },
    { key: 'contact_phone', value: '+91-9999999999', type: 'text', group: 'contact' },
    { key: 'contact_email', value: 'info@hotelanand.com', type: 'text', group: 'contact' },
    { key: 'contact_address', value: 'Gandhi Labour Foundation Road, Near Silicon Hotel, Puri, Odisha - 752001', type: 'text', group: 'contact' },
    { key: 'check_in_time', value: '14:00', type: 'text', group: 'policy' },
    { key: 'check_out_time', value: '11:00', type: 'text', group: 'policy' },
    { key: 'currency', value: 'INR', type: 'text', group: 'payment' },
    { key: 'gst_number', value: '21ABCDE1234F1Z5', type: 'text', group: 'payment' },
  ];

  for (const setting of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Admin: admin@hotelanand.com / Admin@123');
  console.log('Manager: manager@hotelanand.com / Manager@123');
  console.log('Customer: customer@example.com / Customer@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());