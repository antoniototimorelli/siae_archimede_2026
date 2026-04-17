import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { User } from '../types/user'

export const USERS_PATH = path.resolve(__dirname, '../../data/users.json')

export function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf-8')
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('users.json non è un array')
    return parsed as User[]
  } catch (err) {
    throw new Error(`Impossibile leggere users.json: ${(err as Error).message}`)
  }
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const users = readUsers()
  const normalized = email.trim().toLowerCase()
  const user = users.find(u => u.email.trim().toLowerCase() === normalized)
  if (!user) return null
  const match = await bcrypt.compare(password, user.passwordHash)
  return match ? user : null
}

export function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET non definito')
  return jwt.sign({ userId, email }, secret, { expiresIn: '1h' })
}

export function verifyToken(token: string): { userId: string; email: string } {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET non definito')
  const payload = jwt.verify(token, secret)
  if (typeof payload !== 'object' || payload === null || !('userId' in payload) || !('email' in payload)) {
    throw new Error('Payload JWT non valido')
  }
  return payload as { userId: string; email: string }
}
