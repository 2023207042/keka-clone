import { sequelize } from "../config/database";
import { User } from "../models/User";
import { Attendance } from "../models/Attendance";
import { Leave } from "../models/Leave";
import { LeaveBalance } from "../models/LeaveBalance";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("Database synchronized (tables created/updated).");

    // Check if Admin exists
    const adminEmail = "arpudhanaresh@gmail.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log("Admin user already exists.");
    } else {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("Nare@9962618791", 10);

      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "Admin",
        designation: "System Administrator",
        department: "IT",
      });

      // Init Balance
      await LeaveBalance.create({ userId: 1 }); // Assuming Admin ID is 1 (safe for init script on fresh DB)

      console.log("Admin user created successfully.");
    }
  } catch (error) {
    console.error("Unable to initialize database:", error);
  } finally {
    await sequelize.close();
  }
};

initDB();
