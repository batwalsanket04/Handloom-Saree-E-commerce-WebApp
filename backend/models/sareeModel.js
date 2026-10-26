import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
 

const Saree = sequelize.define(
  "Saree",
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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      validate: {
        min: 0,
      },
    },

    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "sarees",
    timestamps: true,

    indexes: [
      {
        fields: ["category"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export default Saree;