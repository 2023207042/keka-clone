import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Query,
  Path,
} from "tsoa";
import { PermissionRequest } from "../models/PermissionRequest";
import { User } from "../models/User";
import { Op } from "sequelize";

interface CreatePermissionParams {
  userId: number;
  type: "Late Clock In" | "Early Check out";
  date: string; // YYYY-MM-DD
  reason: string;
}

interface UpdateStatusParams {
  status: "Approved" | "Rejected";
  remarks?: string;
}

@Route("permissions")
export class PermissionController extends Controller {
  @Get("my-requests")
  public async getMyRequests(
    @Query() userId: number
  ): Promise<PermissionRequest[]> {
    return await PermissionRequest.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });
  }

  @Post("apply")
  @SuccessResponse("201", "Applied")
  public async apply(
    @Body() body: CreatePermissionParams
  ): Promise<PermissionRequest> {
    // Check for duplicates
    const existing = await PermissionRequest.findOne({
      where: {
        userId: body.userId,
        date: body.date,
        type: body.type,
      } as any,
    });

    if (existing) {
      throw new Error("A request for this date and type already exists.");
    }

    return await PermissionRequest.create(body as any);
  }

  @Get("all")
  public async getAllRequests(@Query() status?: string): Promise<any[]> {
    const where: any = {};
    if (status && status !== "All") {
      where.status = status;
    }

    const requests = await PermissionRequest.findAll({
      where,
      include: [
        {
          model: User,
          as: "user", // Ensure association exists
          attributes: ["name", "email"],
        },
      ],
      order: [["date", "DESC"]],
    });

    return requests.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user?.name || "Unknown",
      type: r.type,
      date: r.date,
      reason: r.reason,
      status: r.status,
      adminRemarks: r.adminRemarks,
    }));
  }

  @Post("{id}/status")
  @SuccessResponse("200", "Updated")
  public async updateStatus(
    @Path() id: number,
    @Body() body: UpdateStatusParams
  ): Promise<PermissionRequest> {
    const request = await PermissionRequest.findByPk(id);
    if (!request) {
      throw new Error("Request not found");
    }

    request.status = body.status;
    request.adminRemarks = body.remarks || null;
    await request.save();

    return request;
  }
}
