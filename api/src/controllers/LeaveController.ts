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
    return {
      id: leave.id,
      userId: leave.userId,
      type: leave.type,
      startDate: new Date(leave.startDate).toISOString().split("T")[0],
      endDate: new Date(leave.endDate).toISOString().split("T")[0],
      reason: leave.reason,
      status: leave.status,
    };
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
    }));
  }

  @Get("pending")
  public async getPendingLeaves(): Promise<LeaveResponse[]> {
    const leaves = await Leave.findAll({
      where: { status: "Pending" },
      order: [["startDate", "ASC"]],
    });

    return leaves.map((leave) => ({
      id: leave.id,
      userId: leave.userId,
      type: leave.type,
      startDate: new Date(leave.startDate).toISOString().split("T")[0],
      endDate: new Date(leave.endDate).toISOString().split("T")[0],
      reason: leave.reason,
      status: leave.status,
    }));
  }

  @Post("{id}/status")
  @SuccessResponse("200", "Updated")
  public async updateStatus(
    id: number,
    @Body() body: { status: "Approved" | "Rejected" }
  ): Promise<void> {
    const leave = await Leave.findByPk(id);
    if (!leave) {
      throw new Error("Leave application not found");
    }
    leave.status = body.status;
    await leave.save();

    if (body.status === "Approved") {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await this.deductBalance(leave.userId, leave.type, diffDays);
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
