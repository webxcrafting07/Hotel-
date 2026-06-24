import { Router } from 'express';
import multer from 'multer';
import { getGallery, uploadGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getGallery);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), upload.single('file'), uploadGalleryItem);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), deleteGalleryItem);

export default router;