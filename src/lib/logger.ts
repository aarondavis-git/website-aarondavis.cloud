import pino from 'pino';

// Structured JSON logging — the Node/JS equivalent of Python's `logging`
// module. Same level system (trace/debug/info/warn/error/fatal); usage is
// logger.info({ context }, 'message') instead of logger.info('message', extra=...).
//
// In dev this prints readable colored output; in production it emits plain
// JSON lines, which is what Vercel's log viewer (and most log aggregators)
// expect.
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  }),
});
