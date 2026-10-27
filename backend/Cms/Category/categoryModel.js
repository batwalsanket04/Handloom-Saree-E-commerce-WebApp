import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";


const Category = sequelize.define(
"Category",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},

name:{
type:DataTypes.STRING,
allowNull:false,
unique:true
},


image:{
type:DataTypes.STRING,
allowNull:true
},


status:{
type:DataTypes.BOOLEAN,
defaultValue:true
}

},
{
tableName:"categories",
timestamps:true
}

);


export default Category;