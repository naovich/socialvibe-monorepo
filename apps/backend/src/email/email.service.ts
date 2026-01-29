import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create transporter (development mode with ethereal.email for testing)
    this.createTransporter();
  }

  private async createTransporter() {
    // For development: use ethereal.email (fake SMTP)
    // For production: use real SMTP (Gmail, SendGrid, etc.)
    
    if (process.env.NODE_ENV === 'production') {
      // Production SMTP
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        secure: this.configService.get('SMTP_SECURE') === 'true',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    } else {
      // Development: use ethereal (fake SMTP for testing)
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('📧 Email service initialized (development mode)');
      console.log('📧 Preview emails at: https://ethereal.email');
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/reset-password?token=${resetToken}`;

    const info = await this.transporter.sendMail({
      from: '"SocialVibe" <noreply@socialvibe.com>',
      to: email,
      subject: 'Reset Your Password - SocialVibe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">SocialVibe Team</p>
        </div>
      `,
      text: `Hi ${name},\n\nYou requested to reset your password.\n\nClick this link to reset: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\nSocialVibe Team`,
    });

    // Log preview URL in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Password reset email sent!');
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  async sendEmailVerification(email: string, name: string, verificationToken: string) {
    const verifyUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/verify-email?token=${verificationToken}`;

    const info = await this.transporter.sendMail({
      from: '"SocialVibe" <noreply@socialvibe.com>',
      to: email,
      subject: 'Verify Your Email - SocialVibe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">Welcome to SocialVibe! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Thanks for signing up! Please verify your email address to get started:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">SocialVibe Team</p>
        </div>
      `,
      text: `Hi ${name},\n\nWelcome to SocialVibe!\n\nPlease verify your email: ${verifyUrl}\n\nThis link will expire in 24 hours.\n\nSocialVibe Team`,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Verification email sent!');
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }
}
