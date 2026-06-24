import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export async function getBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '10', category, tag, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({ success: true, data: blogs, pagination: { page: parseInt(page as string), limit: take, total } });
  } catch (error) {
    next(error);
  }
}

export async function getBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
    });

    if (!blog || (!blog.isPublished)) throw new AppError('Blog post not found', 404);

    await prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } });

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

export async function createBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, content, excerpt, category, tags, coverImage, metaTitle, metaDesc, isPublished } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const blog = await prisma.blog.create({
      data: {
        title, content, excerpt, category, tags: tags || [],
        coverImage, metaTitle, metaDesc, slug,
        authorId: req.user!.userId,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

export async function updateBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isPublished, ...rest } = req.body;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

export async function deleteBlog(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
}