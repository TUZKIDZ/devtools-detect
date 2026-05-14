import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await db.user.create({
      data: { name, email, password: hashed, role: 'USER' },
    })

    logger.info('New user registered', { email })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    logger.error('Register error', { err: String(err) })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
