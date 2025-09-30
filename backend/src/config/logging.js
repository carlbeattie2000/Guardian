const winston = require("winston");
const { join } = require("node:path");

const defaultLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: join("logs", "http.log"),
      level: "http",
    }),
    new winston.transports.File({
      filename: join("logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({ filename: join("logs", "combined.log") }),
  ],
});

module.exports = defaultLogger;
