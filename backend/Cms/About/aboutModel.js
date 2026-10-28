import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";


const About = sequelize.define(
    "About",
    {

        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },


        title:{
            type:DataTypes.STRING,
            allowNull:false
        },


        subtitle:{
            type:DataTypes.STRING
        },


        description1:{
            type:DataTypes.TEXT
        },


        description2:{
            type:DataTypes.TEXT
        },


        description3:{
            type:DataTypes.TEXT
        },


        description4:{
            type:DataTypes.TEXT
        },


        buttonText:{
            type:DataTypes.STRING
        },


        buttonLink:{
            type:DataTypes.STRING
        },


        image:{
            type:DataTypes.STRING
        },


        imagePublicId:{
            type:DataTypes.STRING
        }

    },
    {
        tableName:"abouts",
        timestamps:true
    }
);


export default About;