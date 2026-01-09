import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Leave extends Model {
  public id!: number;
  public userId!: number;
  public type!: "Sick" | "Casual" | "Earned";
  public startDate!: Date;
  public endDate!: Date;
  public reason!: string;
  public status!: "Pending" | "Approved" | "Rejected";
  public adminRemarks!: string | null;
}

Leave.init(
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
      type: DataTypes.ENUM("Sick", "Casual", "Earned"),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
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
    tableName: "leaves",
  }
);
