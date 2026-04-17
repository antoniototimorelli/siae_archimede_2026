import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findByEmail } from './user.service'
import type { User } from '../types/user'

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const user = findByEmail(email)
  if (!user) return null
  const match = await bcrypt.compare(password, user.passwordHash)
  return match ? user : null
}

export function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return jwt.sign({ userId, email }, secret, { expiresIn: '1h' })
}

export function verifyToken(token: string): { userId: string; email: string } {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return jwt.verify(token, secret) as { userId: string; email: string }
}
