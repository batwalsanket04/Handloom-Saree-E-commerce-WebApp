import winston from "winston";

const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [

        new winston.transports.File({
            filename: "logs/combined.log"
        }),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        })

    ]

});


if(process.env.NODE_ENV !== "production"){

    logger.add(
        new winston.transports.Console()
    );

}


export default logger;