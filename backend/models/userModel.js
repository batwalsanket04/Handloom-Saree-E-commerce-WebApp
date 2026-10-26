import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "seller", "admin"),
      allowNull: false,
      defaultValue: "user",
    },

    cartData: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },

    phone: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    address: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    tableName: "users",
    timestamps: true, // Automatically creates createdAt & updatedAt

    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["role"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default User;