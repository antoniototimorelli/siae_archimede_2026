import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { User } from '../types/user'

const USERS_PATH = path.resolve(__dirname, '../../data/users.json')

function readUsers(): User[] {
  const raw = fs.readFileSync(USERS_PATH, 'utf-8')
  return JSON.parse(raw) as User[]
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const users = readUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
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
  return jwt.verify(token, secret) as { userId: string; email: string }
}
