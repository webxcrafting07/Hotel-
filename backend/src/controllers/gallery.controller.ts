import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { uploadImage, deleteImage } from '../config/cloudinary';

export async function getGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, mediaType } = req.query;
    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;
    if (mediaType) where.mediaType = mediaType;

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
}

export async function uploadGalleryItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, description, category, mediaType } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file provided' });
      return;
    }

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const { url, publicId } = await uploadImage(base64, 'gallery');
    const inferredMediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';

    const item = await prisma.gallery.create({
      data: { url, publicId, title, description, category, mediaType: mediaType || inferredMediaType },
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (item) {
      await deleteImage(item.publicId);
      await prisma.gallery.delete({ where: { id } });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
}