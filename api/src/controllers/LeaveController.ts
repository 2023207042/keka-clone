import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Query,
} from "tsoa";
import { Leave } from "../models/Leave";
import { LeaveBalance } from "../models/LeaveBalance";
import { User } from "../models/User";
import { emailService } from "../services/EmailService";

interface ApplyLeaveParams {
  userId: number;
  type: "Sick" | "Casual" | "Earned";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
}

interface LeaveResponse {
  id: number;
  userId: number;
  type: "Sick" | "Casual" | "Earned";
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  adminRemarks?: string | null;
  userName?: string;
}

@Route("leave")
export class LeaveController extends Controller {
  @Post("apply")
  @SuccessResponse("201", "Leave Applied")
  public async applyLeave(
    @Body() body: ApplyLeaveParams
  ): Promise<LeaveResponse> {
    // Validate Dates
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);

    if (start > end) {
      throw new Error("Start date cannot be after end date");
    }

    const leave = await Leave.create({
      userId: body.userId,
      type: body.type,
      startDate: start, // Pass Date object
      endDate: end, // Pass Date object
      reason: body.reason,
      status: "Pending",
    });

    // Explicitly map to response
    const response: LeaveResponse = {
      id: leave.id,
      userId: leave.userId,
      type: leave.type,
      startDate: new Date(leave.startDate).toISOString().split("T")[0],
      endDate: new Date(leave.endDate).toISOString().split("T")[0],
      reason: leave.reason,
      status: leave.status,
    };

    // Notify Admins
    try {
      const admins = await User.findAll({ where: { role: "Admin" } });
      const adminEmails = admins
        .map((u) => u.email)
        .filter((e) => e) as string[];
      const requester = await User.findByPk(body.userId);

      if (adminEmails.length > 0 && requester) {
        // Format dates
        const dateRange = `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
        emailService.sendLeaveRequestNotification(
          adminEmails,
          requester.name || "Employee",
          body.type,
          dateRange,
          body.reason
        );
      }
    } catch (err) {
      console.error("Failed to send admin notification email", err);
    }

    return response;
  }

  @Get("my-leaves")
  public async getMyLeaves(@Query() userId: number): Promise<LeaveResponse[]> {
    const leaves = await Leave.findAll({
      where: { userId },
      order: [["startDate", "DESC"]],
    });

    return leaves.map((leave) => ({
      id: leave.id,
      userId: leave.userId,
      type: leave.type,
      startDate: new Date(leave.startDate).toISOString().split("T")[0],
      endDate: new Date(leave.endDate).toISOString().split("T")[0],
      reason: leave.reason,
      status: leave.status,
      adminRemarks: leave.adminRemarks,
    }));
  }

  @Get("all")
  public async getAllLeaves(
    @Query() status?: string
  ): Promise<LeaveResponse[]> {
    const whereClause: any = {};
    if (status && status !== "All") {
      whereClause.status = status;
    }

    const leaves = await Leave.findAll({
      where: whereClause,
      order: [["startDate", "DESC"]],
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    });

    return leaves.map((leave: any) => ({
      id: leave.id,
      userId: leave.userId,
      userName: leave.user?.name || "Unknown",
      type: leave.type,
      startDate: new Date(leave.startDate).toISOString().split("T")[0],
      endDate: new Date(leave.endDate).toISOString().split("T")[0],
      reason: leave.reason,
      status: leave.status,
      adminRemarks: leave.adminRemarks,
    }));
  }

  @Post("{id}/status")
  @SuccessResponse("200", "Updated")
  public async updateStatus(
    id: number,
    @Body() body: { status: "Approved" | "Rejected"; remarks?: string }
  ): Promise<void> {
    const leave = await Leave.findByPk(id);
    if (!leave) {
      throw new Error("Leave application not found");
    }
    leave.status = body.status;
    if (body.remarks) {
      leave.adminRemarks = body.remarks;
    }
    await leave.save();

    if (body.status === "Approved") {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await this.deductBalance(leave.userId, leave.type, diffDays);
    }

    // Notify User
    try {
      const user = await User.findByPk(leave.userId);
      if (user && user.email) {
        const dateRange = `${new Date(
          leave.startDate
        ).toLocaleDateString()} to ${new Date(
          leave.endDate
        ).toLocaleDateString()}`;
        emailService.sendLeaveStatusUpdate(
          user.email,
          user.name || "User",
          body.status,
          dateRange
        );
      }
    } catch (err) {
      console.error("Failed to send status update email", err);
    }
  }

  @Get("balances")
  public async getBalances(@Query() userId: number): Promise<any> {
    let balance = await LeaveBalance.findOne({ where: { userId } });
    if (!balance) {
      // Initialize if not exists (should be done on user create, but fail-safe here)
      balance = await LeaveBalance.create({ userId });
    }

    return {
      Sick: balance.sickTotal - balance.sickUsed,
      Casual: balance.casualTotal - balance.casualUsed,
      Earned: balance.earnedTotal - balance.earnedUsed,
    };
  }

  @Post("balance")
  @SuccessResponse("200", "Balance Updated")
  public async updateBalance(
    @Body()
    body: {
      userId: number;
      sickTotal: number;
      casualTotal: number;
      earnedTotal: number;
    }
  ): Promise<void> {
    let balance = await LeaveBalance.findOne({
      where: { userId: body.userId },
    });
    if (!balance) {
      balance = await LeaveBalance.create({
        userId: body.userId,
        sickTotal: body.sickTotal,
        casualTotal: body.casualTotal,
        earnedTotal: body.earnedTotal,
      });
    } else {
      balance.sickTotal = body.sickTotal;
      balance.casualTotal = body.casualTotal;
      balance.earnedTotal = body.earnedTotal;
      await balance.save();
    }
  }

  // Helper to deduct balance (not an endpoint)
  private async deductBalance(
    userId: number,
    type: "Sick" | "Casual" | "Earned",
    days: number
  ) {
    const balance = await LeaveBalance.findOne({ where: { userId } });
    if (balance) {
      if (type === "Sick") balance.sickUsed += days;
      if (type === "Casual") balance.casualUsed += days;
      if (type === "Earned") balance.earnedUsed += days;
      await balance.save();
    }
  }
}
