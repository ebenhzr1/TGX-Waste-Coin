/**
 * Logger Service - Sprint 26
 * Structured JSON logging to stdout + file. No external deps.
 * ponytail: uses fs.appendFileSync for simplicity; upgrade to winston/pino if volume demands async writes.
 */
const fs = require('fs');
const path = require('path');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const LOG_DIR = isServerless ? '/tmp/logs' : path.join(__dirname, '../../logs');

try {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
} catch (_) {
  // Ignore FS errors on read-only environments
}

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

function getLogFile() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(LOG_DIR, `app-${date}.log`);
}

function write(level, message, meta = {}) {
  if (LEVELS[level] > CURRENT_LEVEL) return;

  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });

  // Always print to stdout
  console.log(entry);

  // Append to daily log file (fire-and-forget, tolerate write errors)
  try {
    fs.appendFileSync(getLogFile(), entry + '\n');
  } catch (_) { /* ignore FS errors */ }
}

const logger = {
  info:  (msg, meta) => write('info',  msg, meta),
  warn:  (msg, meta) => write('warn',  msg, meta),
  error: (msg, meta) => write('error', msg, meta),
  debug: (msg, meta) => write('debug', msg, meta),

  /** Express error handler middleware */
  errorHandler(err, req, res, next) {
    logger.error('Unhandled error', {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    });
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
  },

  /** Express request logger middleware */
  requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      write(level, 'HTTP', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
        ip: req.ip,
      });
    });
    next();
  },
};

module.exports = logger;
