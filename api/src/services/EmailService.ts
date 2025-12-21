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
  async sendLeaveRequestNotification(
    to: string[],
    requesterName: string,
    type: string,
    dates: string,
    reason: string
  ) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Iyyaone Technologies</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #333; margin-top: 0;">New Leave Request</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            <strong>${requesterName}</strong> has submitted a new leave request.
          </p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            <p style="margin: 5px 0; color: #374151;"><strong>Type:</strong> ${type}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Dates:</strong> ${dates}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Reason:</strong> ${reason}</p>
          </div>

          <p style="color: #666; margin-bottom: 30px;">Please login to the admin dashboard to review and take action.</p>
          
          <a href="${
            process.env.CLIENT_URL || "http://localhost:5173"
          }/admin/leaves" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Review Request</a>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Iyyaone Technologies. All rights reserved.
        </div>
      </div>
    `;
    return this.sendMail(
      to.join(","),
      `New Leave Request - ${requesterName}`,
      html
    );
  }

  async sendLeaveStatusUpdate(
    to: string,
    userName: string,
    status: string,
    dates: string
  ) {
    const color = status === "Approved" ? "#059669" : "#DC2626";
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${color}; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Iyyaone Technologies</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #333; margin-top: 0;">Leave Request ${status}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Hello ${userName},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Your leave request for <strong>${dates}</strong> has been <strong style="color: ${color};">${status}</strong>.
          </p>

          <div style="margin-top: 30px;">
             <a href="${
               process.env.CLIENT_URL || "http://localhost:5173"
             }/user/leave" style="display: inline-block; padding: 12px 24px; background-color: ${color}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">View Details</a>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Iyyaone Technologies. All rights reserved.
        </div>
      </div>
    `;
    return this.sendMail(to, `Leave Request ${status}`, html);
  }
}

export const emailService = new EmailService();
