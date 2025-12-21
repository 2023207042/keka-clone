import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    if (!process.env.SMTP_HOST) {
      console.warn("SMTP_HOST not set. Email not sent:", { to, subject });
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Keka Clone"}" <${
          process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
        }>`,
        to,
        subject,
        html,
      });
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendInvitation(to: string, inviteLink: string) {
    const html = `
        <h1>Welcome to Keka Clone</h1>
        <p>You have been invited to join the platform.</p>
        <p>Please click the link below to set your password and activate your account:</p>
        <a href="${inviteLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Set Password</a>
        <p>Or copy this link: ${inviteLink}</p>
      `;
    return this.sendMail(to, "Invitation to Join Keka Clone", html);
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const html = `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `;
    return this.sendMail(to, "Reset Your Password", html);
  }
}

export const emailService = new EmailService();
