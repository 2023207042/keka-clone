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
import { User } from "../models/User";
import { Leave } from "../models/Leave";
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
  userName?: string;
  userEmail?: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  duration?: number;
  status: "Present" | "Half Day" | "Absent";
  workFrom: "Office" | "Home";
}

interface DailySummary {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  duration: number;
  status: string;
}

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
}

@Route("attendance")
export class AttendanceController extends Controller {
  @Get("stats")
  public async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().split("T")[0];

    // 1. Total Employees (Active or Invited)
    const totalEmployees = await User.count({
      where: {
        status: {
          [Op.or]: ["Active", "Invited"],
        },
      },
    });

    // 2. Present Today (Unique users clocked in)
    const presentToday = await Attendance.count({
      distinct: true,
      col: "userId",
      where: {
        date: today,
      },
    });

    // 3. On Leave Today
    const onLeaveToday = await Leave.count({
      where: {
        status: "Approved",
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today },
      },
    });

    const absentToday = Math.max(0, totalEmployees - presentToday);

    return {
      totalEmployees,
      presentToday,
      absentToday,
      onLeaveToday,
    };
  }

  @Post("clock-in")
  @SuccessResponse("200", "Clocked In")
  public async clockIn(
    @Body() body: ClockInParams
  ): Promise<AttendanceResponse> {
    const today = new Date().toISOString().split("T")[0];

    // Check if there is an OPEN session (clockOut is null) for today
    const openSession = await Attendance.findOne({
      where: {
        userId: body.userId,
        date: today,
        clockOut: { [Op.is]: null } as any,
      },
    });

    if (openSession) {
      throw new Error("You are already clocked in. Please clock out first.");
    }

    try {
      return await Attendance.create({
        userId: body.userId,
        date: today,
        clockIn: new Date(),
        workFrom: body.workFrom || "Office",
        status: "Present",
      });
    } catch (error: any) {
      console.error("Attendance Creation Error:", error);
      throw new Error(`Failed to create attendance: ${error.message}`);
    }
  }

  @Post("clock-out")
  @SuccessResponse("200", "Clocked Out")
  public async clockOut(
    @Body() body: ClockOutParams
  ): Promise<AttendanceResponse> {
    const today = new Date().toISOString().split("T")[0];

    // Find the latest OPEN session
    const attendance = await Attendance.findOne({
      where: {
        userId: body.userId,
        date: today,
        clockOut: { [Op.is]: null } as any,
      },
      order: [["clockIn", "DESC"]],
    });

    if (!attendance) {
      throw new Error("No active clock-in session found.");
    }

    const clockOutTime = new Date();
    const duration = Math.floor(
      (clockOutTime.getTime() - new Date(attendance.clockIn).getTime()) / 60000
    ); // Duration in minutes

    attendance.clockOut = clockOutTime;
    attendance.duration = duration;

    // Status is stored per session, but valid for day if any present
    attendance.status = "Present";

    await attendance.save();
    return attendance;
  }

  @Get("today")
  public async getTodayStatus(
    @Query() userId: number
  ): Promise<AttendanceResponse | null> {
    const today = new Date().toISOString().split("T")[0];

    const sessions = await Attendance.findAll({
      where: {
        userId,
        date: today,
      },
      order: [["clockIn", "ASC"]],
    });

    if (sessions.length === 0) {
      return null; // Not clocked in at all today
    }

    // Aggregate
    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];

    const totalDuration = sessions.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );

    // Construct a synthetic response that represents the "Day"
    // If currently clocked in (last session open), clockOut is null
    return {
      id: firstSession.id,
      userId: firstSession.userId,
      date: firstSession.date,
      clockIn: firstSession.clockIn,
      clockOut: lastSession.clockOut, // forward the last clock out (or null)
      duration: totalDuration,
      status: "Present",
      workFrom: firstSession.workFrom,
    } as AttendanceResponse;
  }

  @Get("history")
  public async getHistory(@Query() userId: number): Promise<DailySummary[]> {
    // Generate dates for last 30 days
    const dates: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dates.push(d);
    }

    // Fetch all logs for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await Attendance.findAll({
      where: {
        userId,
        date: { [Op.gte]: thirtyDaysAgo },
      },
    });

    // Map to daily summary
    const history: DailySummary[] = dates.map((date) => {
      const dateStr = date.toLocaleDateString("en-CA"); // YYYY-MM-DD

      // Find logs for this specific date (ignoring time component match issues by using string/date comparison logic if needed, but here simple filter)
      // Note: Sequelize dateOnly is string in JS sometimes, check 'logs' structure if needed.
      // Assuming database date matches.

      const dayLogs = logs.filter((l) => {
        const logDate = new Date(l.date);
        return logDate.toDateString() === date.toDateString();
      });

      if (dayLogs.length === 0) {
        return {
          date: dateStr,
          clockIn: null,
          clockOut: null,
          duration: 0,
          status: "Absent",
        };
      }

      const sortedLogs = dayLogs.sort(
        (a, b) => new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime()
      );
      const firstIn = sortedLogs[0].clockIn;
      const lastOut = sortedLogs[sortedLogs.length - 1].clockOut;
      const totalDuration = sortedLogs.reduce(
        (acc, curr) => acc + (curr.duration || 0),
        0
      );

      return {
        date: dateStr,
        clockIn: firstIn.toISOString(),
        // If last session is open (today?), lastOut is null
        clockOut: lastOut ? lastOut.toISOString() : null,
        duration: totalDuration,
        status: "Present",
      };
    });

    return history;
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
      include: [
        {
          model: User,
          as: "user", // Ensure this matches alias in model association if any, usually just 'User' or default
          attributes: ["name", "email"],
        },
      ],
      order: [
        ["date", "DESC"],
        ["clockIn", "DESC"],
      ],
    });

    return logs.map((log: any) => ({
      id: log.id,
      userId: log.userId,
      userName: log.user?.name || "Unknown",
      userEmail: log.user?.email || "Unknown",
      date: log.date,
      clockIn: log.clockIn,
      clockOut: log.clockOut,
      duration: log.duration, // Duration in minutes
      status: log.status,
      workFrom: log.workFrom,
    }));
  }
}
