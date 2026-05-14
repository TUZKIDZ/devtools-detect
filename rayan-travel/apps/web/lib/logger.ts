type Level = 'info' | 'warn' | 'error'
type Entry = { level: Level; msg: string; meta?: Record<string, unknown> }

const queue: Entry[] = []
let flushing = false

async function flush() {
  if (flushing || queue.length === 0) return
  flushing = true
  while (queue.length > 0) {
    const { level, msg, meta } = queue.shift()!
    if (process.env.NODE_ENV === 'production') {
      process.stdout.write(JSON.stringify({ ts: Date.now(), level, msg, ...meta }) + '\n')
    } else {
      console[level](`[${level.toUpperCase()}]`, msg, meta ?? '')
    }
  }
  flushing = false
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    queue.push({ level: 'info', msg, meta })
    setImmediate(flush)
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    queue.push({ level: 'warn', msg, meta })
    setImmediate(flush)
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    queue.push({ level: 'error', msg, meta })
    setImmediate(flush)
  },
}
