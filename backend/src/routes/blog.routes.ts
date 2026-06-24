import { Router } from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), createBlog);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), updateBlog);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteBlog);

export default router;