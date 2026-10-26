import { Sequelize } from "sequelize";
import "dotenv/config";


const sequelize = new Sequelize(
    process.env.DB_NAME,        // database name
    process.env.DB_USERNAME,    // postgres username
    process.env.DB_PASSWORD,    // password
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DIALECT,
        logging: false,
    }
);


export default sequelize;