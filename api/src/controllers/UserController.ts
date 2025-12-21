import { Body, Controller, Get, Post, Route, SuccessResponse } from "tsoa";
import { User } from "../models/User";
import { LeaveBalance } from "../models/LeaveBalance";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { emailService } from "../services/EmailService";

interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
  role: "Admin" | "Employee";
  department?: string;
  designation?: string;
}

interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Employee";
  department?: string;
  designation?: string;
  status: string; // 'Active' | 'Invited' | 'Inactive'
  inviteLink?: string;
}

@Route("users")
export class UserController extends Controller {
  @Get("/")
  public async getUsers(): Promise<UserDTO[]> {
    const users = await User.findAll();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      designation: u.designation,
      status: u.status || "Active", // Default to Active
      inviteLink: u.inviteToken
        ? `http://localhost:5173/setup-password?token=${u.inviteToken}`
        : undefined,
    }));
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  public async createUser(
    @Body() body: CreateUserParams
  ): Promise<UserDTO & { inviteLink?: string }> {
    const existing = await User.findOne({ where: { email: body.email } });
    if (existing) {
      throw new Error("Email already registered");
    }

    // Generate Invite Token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // We don't set password yet
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: null as any, // Allow null
      role: body.role,
      department: body.department,
      designation: body.designation,
      inviteToken: inviteToken,
      status: "Invited",
    });

    // Initialize Leave Balance
    await LeaveBalance.create({ userId: user.id });

    const inviteLink = `http://localhost:5173/setup-password?token=${inviteToken}`;

    // Send Email
    try {
      await emailService.sendInvitation(user.email, inviteLink);
    } catch (e) {
      console.error("Failed to send invite email", e);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      inviteLink,
      status: "Invited",
    } as any;
  }
}
