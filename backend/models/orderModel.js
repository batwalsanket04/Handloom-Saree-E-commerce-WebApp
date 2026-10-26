 import { DataTypes } from "sequelize";
 import sequelize from "../config/db.js";
 import User from "./userModel.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    // Store ordered products as JSON
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    // Shipping address
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Order Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled"
      ),
      defaultValue: "Order Processing",
    },

    payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "orders",
    timestamps: true,

    indexes: [
      {
        fields: ["userId", "createdAt"],
      },
      {
        fields: ["status", "createdAt"],
      },
    ],
  }
);

export default Order;