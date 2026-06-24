import { Router } from 'express';
import {
  getRooms, getRoom, createRoom, updateRoom, deleteRoom,
  checkAvailability, uploadRoomImages, deleteRoomImage,
  setPrimaryImage, getAmenities
} from '../controllers/room.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uploadRoomMedia } from '../middleware/upload';

const router = Router();

router.get('/', getRooms);
router.get('/check-availability', checkAvailability);
router.get('/amenities', getAmenities);
router.get('/:id', getRoom);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), createRoom);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), updateRoom);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteRoom);

// Image management routes
router.post('/:id/images', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), uploadRoomMedia.array('files', 10), uploadRoomImages);
router.delete('/:id/images/:imageId', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), deleteRoomImage);
router.put('/:id/images/:imageId/primary', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), setPrimaryImage);

export default router;