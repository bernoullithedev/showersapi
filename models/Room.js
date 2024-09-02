import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Room = sequelize.define(
  "Room",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomNumbers: {
      type: DataTypes.JSON, // Array of objects with number and unavailableDates
    },
  },
  {
    timestamps: true,
  }
);

export default Room;
