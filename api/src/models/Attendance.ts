import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Attendance extends Model {
  public id!: number;
  public userId!: number;
  public date!: Date;
  public clockIn!: Date;
  public clockOut?: Date;
  public duration?: number; // In minutes
  public status!: "Present" | "Half Day" | "Absent";
  public workFrom!: "Office" | "Home";
}

Attendance.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    clockIn: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('clockIn');
        return rawValue; // Sequelize will serialize to ISO string in JSON
      }
    },
    clockOut: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('clockOut');
        return rawValue; // Sequelize will serialize to ISO string in JSON
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Present", "Half Day", "Absent"),
      defaultValue: "Present",
    },
    workFrom: {
      type: DataTypes.ENUM("Office", "Home"),
      defaultValue: "Office",
    },
  },
  {
    sequelize,
    tableName: "attendance",
  }
);
