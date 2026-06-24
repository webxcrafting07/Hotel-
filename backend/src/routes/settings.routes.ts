import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const settings = await prisma.websiteSetting.findMany();
    const obj = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json({ success: true, data: obj });
  } catch (error) { next(error) }
});

router.post('/', authenticate, authorize('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { key, value, type, group } = req.body;
    const setting = await prisma.websiteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: type || 'text', group },
    });
    res.json({ success: true, data: setting });
  } catch (error) { next(error) }
});

export default router;
