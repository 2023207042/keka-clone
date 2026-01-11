import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class PermissionRequest extends Model {
  public id!: number;
  public userId!: number;
  public type!: "Late Clock In" | "Early Check out";
  public date!: Date;
  public reason!: string;
  public status!: "Pending" | "Approved" | "Rejected";
  public adminRemarks!: string | null;
}

PermissionRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Late Clock In", "Early Check out"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
    adminRemarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "permission_requests",
  }
);
