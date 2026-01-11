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

interface PermissionRequestDTO {
  id: number;
  userId: number;
  userName?: string;
  type: "Late Clock In" | "Early Check out";
  date: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  adminRemarks?: string | null;
}

@Route("permissions")
export class PermissionController extends Controller {
  @Get("my-requests")
  public async getMyRequests(
    @Query() userId: number
  ): Promise<PermissionRequestDTO[]> {
    const requests = await PermissionRequest.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });

    return requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type,
      date: r.date,
      reason: r.reason,
      status: r.status,
      adminRemarks: r.adminRemarks,
    }));
  }

  @Post("apply")
  @SuccessResponse("201", "Applied")
  public async apply(
    @Body() body: CreatePermissionParams
  ): Promise<PermissionRequestDTO> {
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

    const created = await PermissionRequest.create(body as any);

    return {
      id: created.id,
      userId: created.userId,
      type: created.type,
      date: created.date,
      reason: created.reason,
      status: created.status,
      adminRemarks: created.adminRemarks,
    };
  }

  @Get("all")
  public async getAllRequests(
    @Query() status?: string
  ): Promise<PermissionRequestDTO[]> {
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
  ): Promise<PermissionRequestDTO> {
    const request = await PermissionRequest.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["name"] }],
    });

    if (!request) {
      throw new Error("Request not found");
    }

    request.status = body.status;
    request.adminRemarks = body.remarks || null;
    await request.save();

    return {
      id: request.id,
      userId: request.userId,
      userName: (request as any).user?.name,
      type: request.type,
      date: request.date,
      reason: request.reason,
      status: request.status,
      adminRemarks: request.adminRemarks,
    };
  }
}
