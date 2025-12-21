import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class LeaveBalance extends Model {
  public id!: number;
  public userId!: number;
  public sickTotal!: number;
  public sickUsed!: number;
  public casualTotal!: number;
  public casualUsed!: number;
  public earnedTotal!: number;
  public earnedUsed!: number;
}

LeaveBalance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    sickTotal: { type: DataTypes.INTEGER, defaultValue: 10 },
    sickUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
    casualTotal: { type: DataTypes.INTEGER, defaultValue: 10 },
    casualUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
    earnedTotal: { type: DataTypes.INTEGER, defaultValue: 15 },
    earnedUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: "leave_balances",
    timestamps: false,
  }
);
