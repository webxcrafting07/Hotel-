import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({ where: { isActive: true } });
    res.json({ success: true, data: packages });
  } catch (error) { next(error) }
});

router.post('/', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), async (req, res, next) => {
  try {
    const pkg = await prisma.package.create({ data: req.body });
    res.status(201).json({ success: true, data: pkg });
  } catch (error) { next(error) }
});

export default router;
