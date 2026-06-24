import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controllers/housekeeping.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN', 'MANAGER', 'HOUSEKEEPING'));

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;