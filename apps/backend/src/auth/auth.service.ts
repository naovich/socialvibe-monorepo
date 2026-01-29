import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, username } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refresh(refreshToken: string) {
    // Verify refresh token exists in DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(storedToken.userId);

    // Delete old refresh token
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    return tokens;
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    // Generate access token (15 minutes)
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Generate refresh token (7 days)
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId,
        expiresAt,
      },
    });

    return { access_token, refresh_token };
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save token (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send email
    await this.emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find all non-expired tokens
    const tokens = await this.prisma.passwordResetToken.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    // Find matching token
    let validToken: typeof tokens[0] | null = null;
    for (const t of tokens) {
      const isValid = await bcrypt.compare(token, t.token);
      if (isValid) {
        validToken = t;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: validToken.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await this.prisma.passwordResetToken.delete({
      where: { id: validToken.id },
    });

    // Delete all other reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: validToken.userId },
    });

    return { message: 'Password reset successful' };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(verificationToken, 10);

    // Save token (expires in 24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.emailVerificationToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send email
    await this.emailService.sendEmailVerification(user.email, user.name, verificationToken);

    return { message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    // Find all non-expired tokens
    const tokens = await this.prisma.emailVerificationToken.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    // Find matching token
    let validToken: typeof tokens[0] | null = null;
    for (const t of tokens) {
      const isValid = await bcrypt.compare(token, t.token);
      if (isValid) {
        validToken = t;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark user as verified (if you have an emailVerified field)
    // await this.prisma.user.update({
    //   where: { id: validToken.userId },
    //   data: { emailVerified: true },
    // });

    // Delete used token
    await this.prisma.emailVerificationToken.delete({
      where: { id: validToken.id },
    });

    // Delete all other verification tokens for this user
    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId: validToken.userId },
    });

    return { message: 'Email verified successfully' };
  }
}
