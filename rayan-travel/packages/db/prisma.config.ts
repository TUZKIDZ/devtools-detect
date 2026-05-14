import { defineConfig } from 'prisma/config'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  const candidates = [
    resolve(__dirname, '.env'),
    resolve(__dirname, '../../apps/web/.env.local'),
  ]
  for (const p of candidates) {
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf-8').split('\n')) {
      const match = line.match(/^([^#=\s][^=]*)=(.*)$/)
      if (!match) continue
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
    break
  }
}

loadEnv()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrate: {
    async adapter() {
      const url = process.env.DATABASE_URL
      if (!url) throw new Error('DATABASE_URL manquant. Vérifie apps/web/.env.local')
      const { PrismaPg } = await import('@prisma/adapter-pg')
      return new PrismaPg({ connectionString: url })
    },
  },
})
