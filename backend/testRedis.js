import redisClient from "./config/redis.js";


const test = async()=>{

await redisClient.set(
    "test",
    "hello"
);


const value = await redisClient.get("test");


console.log(value);


process.exit();

}


test();