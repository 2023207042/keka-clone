import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import { User } from "../models/User";
import { LeaveBalance } from "../models/LeaveBalance";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { emailService } from "../services/EmailService";

interface LoginParams {
  email: string;
  password?: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password?: string;
  role?: "Admin" | "Employee"; // Optional, default Employee
  secret?: string; // Simple way to allow creating Admins
}

interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: "Admin" | "Employee";
  token: string;
}

@Route("auth")
export class AuthController extends Controller {
  @Post("login")
  @SuccessResponse("200", "Success")
  public async login(@Body() body: LoginParams): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: body.email } });
    if (!user) {
      throw new Error("User not found");
    }

    if (!body.password) {
      throw new Error("Password required");
    }

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    };
  }

  @Post("setup-password")
  @SuccessResponse("200", "Password Set")
  public async setupPassword(
    @Body() body: { token: string; password: string }
  ): Promise<void> {
    const user = await User.findOne({ where: { inviteToken: body.token } });
    if (!user) {
      throw new Error("Invalid or expired invitation token");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    user.password = hashedPassword;
    user.status = "Active";
    user.inviteToken = null as any; // Clear token
    await user.save();
  }

  @Post("register")
  @SuccessResponse("201", "Created")
  public async register(@Body() body: RegisterParams): Promise<UserResponse> {
    const existing = await User.findOne({ where: { email: body.email } });
    if (existing) {
      throw new Error("Email already registered");
    }

    if (!body.password) {
      throw new Error("Password required");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Simple Admin Safeguard
    let role: "Admin" | "Employee" = "Employee";
    if (body.role === "Admin") {
      if (body.secret !== "super-admin-secret") {
        // Hardcoded secret for demo
        throw new Error("Invalid admin secret");
      }
      role = "Admin";
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: role,
    });

    // Initialize Leave Balance
    await LeaveBalance.create({ userId: user.id });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    };
  }

  @Post("request-password-reset")
  @SuccessResponse("200", "Email Sent")
  public async forgotPassword(@Body() body: { email: string }): Promise<void> {
    const user = await User.findOne({ where: { email: body.email } });
    if (!user) {
      // We don't want to reveal if user exists, so we just return success
      return;
    }

    // Reuse inviteToken field for reset token (or create a new field if strict separation needed)
    // For simplicity, we use inviteToken as a temporary "action token"
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.inviteToken = resetToken;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    try {
      await emailService.sendPasswordReset(user.email, resetLink);
    } catch (e) {
      console.error("Failed to send reset email", e);
    }
  }

  @Post("reset-password")
  @SuccessResponse("200", "Password Reset")
  public async resetPassword(
    @Body() body: { token: string; password: string }
  ): Promise<void> {
    const user = await User.findOne({ where: { inviteToken: body.token } });
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    user.password = hashedPassword;
    user.inviteToken = null as any;
    await user.save();
  }
}
