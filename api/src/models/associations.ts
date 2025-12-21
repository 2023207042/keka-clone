import { User } from "./User";
import { Attendance } from "./Attendance";
import { Leave } from "./Leave";
import { LeaveBalance } from "./LeaveBalance";

export const setupAssociations = () => {
  // User <-> Attendance
  User.hasMany(Attendance, { foreignKey: "userId", as: "attendance" });
  Attendance.belongsTo(User, { foreignKey: "userId", as: "user" });

  // User <-> Leave
  User.hasMany(Leave, { foreignKey: "userId", as: "leaves" });
  Leave.belongsTo(User, { foreignKey: "userId", as: "user" });

  // User <-> LeaveBalance
  User.hasOne(LeaveBalance, { foreignKey: "userId", as: "leaveBalance" });
  LeaveBalance.belongsTo(User, { foreignKey: "userId", as: "user" });
};
