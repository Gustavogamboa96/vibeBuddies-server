const { createLogger, format, transports } = require("winston")
const { combine, timestamp, printf, colorize } = format

// Formats log messages
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

const logger = createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // Console captures every level with color for normal logs
    new transports.Console({
      format: combine(colorize({ all: true }), logFormat),
      level: "debug",
    }),

    // app.log captures every level
    new transports.File({
      filename: "app.log",
      level: "debug",
    }),

    // error.log captures only error
    new transports.File({
      filename: "error.log",
      level: "error",
    }),

    // warn.log captures warn and error
    new transports.File({
      filename: "warn.log",
      level: "warn",
    }),
  ],

  // exceptions.log captures uncaught exceptions without color in the console
  exceptionHandlers: [
    new transports.File({
      filename: "exceptions.log",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
    new transports.Console({
      format: combine(logFormat),
    }),
  ],

  // rejections.log captures unhandled promise rejections without color in the console
  rejectionHandlers: [
    new transports.File({
      filename: "rejections.log",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),
    new transports.Console({
      format: combine(logFormat),
    }),
  ],
})

module.exports = logger
