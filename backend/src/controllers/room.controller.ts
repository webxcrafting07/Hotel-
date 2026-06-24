import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { uploadImage, deleteImage } from '../config/cloudinary';

export async function getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = '1', limit = '10', roomType, minPrice, maxPrice,
      adults, children, checkIn, checkOut, sortBy = 'pricePerNight', order = 'asc'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = { isActive: true };

    if (roomType) where.roomType = roomType;
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) (where.pricePerNight as Record<string, unknown>).gte = parseFloat(minPrice as string);
      if (maxPrice) (where.pricePerNight as Record<string, unknown>).lte = parseFloat(maxPrice as string);
    }
    if (adults) where.maxAdults = { gte: parseInt(adults as string) };
    if (children) where.maxChildren = { gte: parseInt(children as string) };

    // Check availability if dates provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);

      const bookedRoomIds = await prisma.booking.findMany({
        where: {
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
          OR: [
            { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
          ],
        },
        select: { roomId: true },
      });

      const bookedIds = bookedRoomIds.map((b) => b.roomId);
      if (bookedIds.length > 0) {
        where.id = { notIn: bookedIds };
      }
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy as string]: order },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          amenities: { include: { amenity: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.room.count({ where }),
    ]);

    const roomsWithRating = rooms.map((room) => ({
      ...room,
      avgRating: room.reviews.length > 0
        ? room.reviews.reduce((acc, r) => acc + r.rating, 0) / room.reviews.length
        : 0,
      reviewCount: room.reviews.length,
    }));

    res.json({
      success: true,
      data: roomsWithRating,
      pagination: { page: parseInt(page as string), limit: take, total, pages: Math.ceil(total / take) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const room = await prisma.room.findFirst({
      where: { OR: [{ id }, { roomNumber: id }], isActive: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!room) throw new AppError('Room not found', 404);

    const avgRating = room.reviews.length > 0
      ? room.reviews.reduce((acc, r) => acc + r.rating, 0) / room.reviews.length
      : 0;

    res.json({ success: true, data: { ...room, avgRating, reviewCount: room.reviews.length } });
  } catch (error) {
    next(error);
  }
}

export async function createRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomNumbers, amenityIds, ...roomData } = req.body;

    // Support bulk creation: roomNumbers can be a comma-separated string or array
    const numbers: string[] = Array.isArray(roomNumbers)
      ? roomNumbers
      : typeof roomNumbers === 'string'
        ? roomNumbers.split(',').map((n: string) => n.trim()).filter(Boolean)
        : [roomData.roomNumber];

    if (numbers.length === 0) throw new AppError('At least one room number is required', 400);

    const createdRooms = [];

    for (const roomNumber of numbers) {
      // Check duplicate
      const exists = await prisma.room.findUnique({ where: { roomNumber } });
      if (exists) {
        throw new AppError(`Room number ${roomNumber} already exists`, 409);
      }

      const room = await prisma.room.create({
        data: {
          ...roomData,
          roomNumber,
          floor: roomData.floor ? parseInt(roomData.floor) : Math.floor(parseInt(roomNumber) / 100),
          pricePerNight: parseFloat(roomData.pricePerNight),
          weekendPrice: roomData.weekendPrice ? parseFloat(roomData.weekendPrice) : parseFloat(roomData.pricePerNight),
          festivalPrice: roomData.festivalPrice ? parseFloat(roomData.festivalPrice) : parseFloat(roomData.pricePerNight),
          basePrice: roomData.basePrice ? parseFloat(roomData.basePrice) : null,
          maxAdults: roomData.maxAdults ? parseInt(roomData.maxAdults) : 2,
          maxChildren: roomData.maxChildren ? parseInt(roomData.maxChildren) : 1,
          maxOccupancy: roomData.maxOccupancy ? parseInt(roomData.maxOccupancy) : 3,
          bathrooms: roomData.bathrooms ? parseInt(roomData.bathrooms) : 1,
          size: roomData.size ? parseFloat(roomData.size) : null,
          hasBalcony: roomData.hasBalcony === true || roomData.hasBalcony === 'true',
          hasWifi: roomData.hasWifi !== false && roomData.hasWifi !== 'false',
          hasAC: roomData.hasAC !== false && roomData.hasAC !== 'false',
          hasBreakfast: roomData.hasBreakfast === true || roomData.hasBreakfast === 'true',
          hasTV: roomData.hasTV !== false && roomData.hasTV !== 'false',
          hasRoomService: roomData.hasRoomService !== false && roomData.hasRoomService !== 'false',
          amenities: amenityIds && amenityIds.length > 0
            ? { create: amenityIds.map((amenityId: string) => ({ amenityId })) }
            : undefined,
        },
      });
      createdRooms.push(room);
    }

    res.status(201).json({
      success: true,
      message: `${createdRooms.length} room(s) created successfully`,
      data: createdRooms,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { amenityIds, ...updateData } = req.body;

    // Parse numeric fields if present
    if (updateData.pricePerNight) updateData.pricePerNight = parseFloat(updateData.pricePerNight);
    if (updateData.weekendPrice) updateData.weekendPrice = parseFloat(updateData.weekendPrice);
    if (updateData.festivalPrice) updateData.festivalPrice = parseFloat(updateData.festivalPrice);
    if (updateData.basePrice !== undefined) updateData.basePrice = updateData.basePrice ? parseFloat(updateData.basePrice) : null;
    if (updateData.floor) updateData.floor = parseInt(updateData.floor);
    if (updateData.maxAdults) updateData.maxAdults = parseInt(updateData.maxAdults);
    if (updateData.maxChildren) updateData.maxChildren = parseInt(updateData.maxChildren);
    if (updateData.maxOccupancy) updateData.maxOccupancy = parseInt(updateData.maxOccupancy);
    if (updateData.bathrooms) updateData.bathrooms = parseInt(updateData.bathrooms);
    if (updateData.size) updateData.size = parseFloat(updateData.size);

    // Handle amenities update
    if (amenityIds !== undefined) {
      // Delete existing amenities and recreate
      await prisma.roomAmenity.deleteMany({ where: { roomId: id } });
      if (amenityIds.length > 0) {
        await prisma.roomAmenity.createMany({
          data: amenityIds.map((amenityId: string) => ({ roomId: id, amenityId })),
        });
      }
      delete updateData.amenityIds;
    }

    const room = await prisma.room.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
      },
    });
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.room.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: roomId as string,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });

    res.json({ success: true, data: { available: !conflict } });
  } catch (error) {
    next(error);
  }
}

// Upload images/videos for a room
export async function uploadRoomImages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) throw new AppError('No files uploaded', 400);

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw new AppError('Room not found', 404);

    // Get current image count for order
    const existingCount = await prisma.roomImage.count({ where: { roomId: id } });

    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.mimetype.startsWith('video/');
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await uploadImage(base64, `rooms/${room.roomNumber}`);

      const image = await prisma.roomImage.create({
        data: {
          roomId: id,
          url: result.url,
          publicId: result.publicId,
          isVideo,
          isPrimary: existingCount === 0 && i === 0, // First image is primary if no images exist
          order: existingCount + i,
        },
      });
      uploadedImages.push(image);
    }

    res.status(201).json({ success: true, data: uploadedImages });
  } catch (error) {
    next(error);
  }
}

// Delete a specific room image
export async function deleteRoomImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.roomImage.findFirst({ where: { id: imageId, roomId: id } });
    if (!image) throw new AppError('Image not found', 404);

    // Delete from Cloudinary
    await deleteImage(image.publicId);

    // Delete from DB
    await prisma.roomImage.delete({ where: { id: imageId } });

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Set primary image
export async function setPrimaryImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, imageId } = req.params;

    // Unset all primaries for this room
    await prisma.roomImage.updateMany({ where: { roomId: id }, data: { isPrimary: false } });

    // Set the selected one as primary
    await prisma.roomImage.update({ where: { id: imageId }, data: { isPrimary: true } });

    res.json({ success: true, message: 'Primary image updated' });
  } catch (error) {
    next(error);
  }
}

// Get all amenities
export async function getAmenities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: amenities });
  } catch (error) {
    next(error);
  }
}