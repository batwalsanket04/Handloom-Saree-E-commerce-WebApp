require("dotenv").config({override:true});


console.log("ENV CHECK:");
console.log("USER:", process.env.DB_USERNAME);
console.log("PASSWORD:", process.env.DB_PASSWORD);
console.log("DATABASE:", process.env.DB_NAME);


module.exports = {

development: {

username: process.env.DB_USERNAME,

password: process.env.DB_PASSWORD,

database: process.env.DB_NAME,

host: process.env.DB_HOST,

port: process.env.DB_PORT,

dialect: "postgres"

},


production: {

username: process.env.DB_NAME,

password: process.env.DB_PASSWORD,

database: process.env.DBNAME,

host: process.env.DB_HOST,

port: process.env.DB_PORT,

dialect: process.env.DIALECT

}

};