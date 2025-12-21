import cron from "node-cron";
import { Attendance } from "../models/Attendance";
import { Op } from "sequelize";

export const initCronJobs = () => {
  // Run every day at midnight (00:00) IST
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Running Midnight Auto-Clockout Job (IST)...");

      // Get "Today" in IST (YYYY-MM-DD)
      const todayIST = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      try {
        // Find all sessions that are still OPEN (clockOut is null)
        // AND date is BEFORE todayIST (i.e. yesterday or older in IST terms)
        const staleSessions = await Attendance.findAll({
          where: {
            clockOut: { [Op.is]: null } as any,
            date: { [Op.lt]: todayIST },
          },
        });

        console.log(
          `Found ${staleSessions.length} stale sessions (Date < ${todayIST}).`
        );

        for (const session of staleSessions) {
          // User Requirement: "it should be 0 0" -> Duration 0
          // "mark as not checked out" -> We keep clockOut as null?
          // Or do we set it to something?
          // If we keep clockOut as null, we rely on Frontend to say "Not Clocked Out" if date < today.
          // We will set duration to 0 and Status to 'Absent' (or 'Half Day'?)
          // Let's set Status to 'Absent' effectively invalidating the attendance credit.

          session.duration = 0;
          session.status = "Absent";
          await session.save();
        }

        console.log("Midnight Job Completed.");
      } catch (error) {
        console.error("Error in Midnight Job:", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron Jobs Initialized.");
};
