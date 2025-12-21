import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Query,
} from "tsoa";
import { Attendance } from "../models/Attendance";
import { Op } from "sequelize";

interface ClockInParams {
  userId: number;
  workFrom?: "Office" | "Home";
}

interface ClockOutParams {
  userId: number;
}

interface AttendanceResponse {
  id: number;
  userId: number;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  duration?: number;
  status: "Present" | "Half Day" | "Absent";
  workFrom: "Office" | "Home";
}

@Route("attendance")
export class AttendanceController extends Controller {
  @Post("clock-in")
  @SuccessResponse("200", "Clocked In")
  public async clockIn(
    @Body() body: ClockInParams
  ): Promise<AttendanceResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existing = await Attendance.findOne({
      where: {
        userId: body.userId,
        date: today,
      },
    });

    if (existing) {
      throw new Error("Already clocked in for today");
    }

    return await Attendance.create({
      userId: body.userId,
      date: new Date(),
      clockIn: new Date(),
      workFrom: body.workFrom || "Office",
      status: "Present",
    });
  }

  @Post("clock-out")
  @SuccessResponse("200", "Clocked Out")
  public async clockOut(
    @Body() body: ClockOutParams
  ): Promise<AttendanceResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      where: {
        userId: body.userId,
        date: today,
      },
    });

    if (!attendance) {
      throw new Error("No clock-in record found for today");
    }

    if (attendance.clockOut) {
      throw new Error("Already clocked out");
    }

    const clockOutTime = new Date();
    const duration = Math.floor(
      (clockOutTime.getTime() - new Date(attendance.clockIn).getTime()) / 60000
    ); // Duration in minutes

    attendance.clockOut = clockOutTime;
    attendance.duration = duration;

    // Simple Half Day Logic (e.g., < 4 hours)
    if (duration < 240) {
      attendance.status = "Half Day";
    }

    await attendance.save();
    return attendance;
  }

  @Get("today")
  public async getTodayStatus(
    @Query() userId: number
  ): Promise<AttendanceResponse | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await Attendance.findOne({
      where: {
        userId,
        date: today,
      },
    });
  }

  @Get("history")
  public async getHistory(
    @Query() userId: number
  ): Promise<AttendanceResponse[]> {
    return await Attendance.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit: 30,
    });
  }
  @Get("all")
  public async getAllAttendance(
    @Query() startDate?: string,
    @Query() endDate?: string,
    @Query() userId?: number
  ): Promise<AttendanceResponse[]> {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: new Date(startDate),
      };
    }

    if (userId) {
      where.userId = userId;
    }

    const logs = await Attendance.findAll({
      where,
      order: [
        ["date", "DESC"],
        ["clockIn", "DESC"],
      ],
    });

    return logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      date: log.date,
      clockIn: log.clockIn,
      clockOut: log.clockOut,
      duration: log.duration,
      status: log.status,
      workFrom: log.workFrom,
    }));
  }
}
