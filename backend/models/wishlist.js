import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
  }
);

export default Wishlist;