import winston from 'winston'
import dotenv from 'dotenv'
dotenv.config();

// Create a logger to be used throughout the app. The logger will log to a file
// called log.log.
const logger = winston.createLogger({
    // look for env variable setting, default to info
    level: process.env.LOGLEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'log.log' })
    ]
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export { logger }