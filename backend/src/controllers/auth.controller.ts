import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { ENV } from '../config/env';
import { sendEmail } from '../utils/email';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: ENV.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = uuidv4().slice(0, 8).toUpperCase();
    const emailVerifyToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        referralCode,
        emailVerifyToken,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    // Send verification email (non-blocking)
    sendEmail({
      to: email,
      subject: 'Verify your email - Hotel The Anand',
      html: `<p>Click <a href="${ENV.CLIENT_URL}/verify-email?token=${emailVerifyToken}">here</a> to verify your email.</p>`,
    }).catch(console.error);

    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data: user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

import axios from 'axios';

export async function googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { credential } = req.body; // This is the access_token from the frontend
    
    // Fetch user profile from Google using the access token
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` }
    });
    
    const payload = googleResponse.data;
    if (!payload || !payload.email) throw new AppError('Invalid Google Token', 401);
    
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    
    if (user) {
      if (!user.isActive) throw new AppError('Account is disabled', 401);
      // Ensure only customers can use Google login
      if (user.role !== 'CUSTOMER') {
        throw new AppError('Staff accounts cannot log in via Google', 403);
      }
    } else {
      // Create new user
      const randomPassword = await bcrypt.hash(uuidv4() + uuidv4(), 12);
      const referralCode = uuidv4().slice(0, 8).toUpperCase();
      
      user = await prisma.user.create({
        data: {
          email: payload.email,
          password: randomPassword,
          firstName: payload.given_name || payload.email.split('@')[0],
          lastName: payload.family_name || '',
          avatar: payload.picture || null,
          role: 'CUSTOMER',
          isEmailVerified: true,
          referralCode,
        }
      });
    }

    const jwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError('No refresh token', 401);

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401);

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });

    res.cookie('accessToken', newAccessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newRefreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user) {
      await prisma.user.update({ where: { id: req.user.userId }, data: { refreshToken: null } });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, loyaltyPoints: true, referralCode: true, createdAt: true, isEmailVerified: true },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      res.json({ success: true, message: 'If email exists, reset link has been sent.' });
      return;
    }

    const resetToken = uuidv4();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: resetToken, passwordResetExpiry: expiry },
    });

    await sendEmail({
      to: email,
      subject: 'Password Reset - Hotel The Anand',
      html: `<p>Click <a href="${ENV.CLIENT_URL}/reset-password?token=${resetToken}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    res.json({ success: true, message: 'Password reset email sent.' });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
    });

    if (!user) throw new AppError('Invalid or expired reset token', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, passwordResetToken: null, passwordResetExpiry: null },
    });

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    next(error);
  }
}