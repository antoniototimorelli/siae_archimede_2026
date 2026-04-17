import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import type { User, RegisterPayload } from '../types/user'

const DATA_PATH = path.join(__dirname, '../../users.json')

export function readUsers(): User[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw) as User[]
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2))
}

export function findByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id)
}

export function findByFiscalCode(fiscalCode: string): User | undefined {
  return readUsers().find((u) => u.fiscalCode.toLowerCase() === fiscalCode.toLowerCase())
}

export function createUser(payload: RegisterPayload): Omit<User, 'passwordHash'> {
  const users = readUsers()
  const passwordHash = bcrypt.hashSync(payload.password, 10)
  const user: User = {
    id: crypto.randomUUID(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    fiscalCode: payload.fiscalCode,
    email: payload.email,
    passwordHash,
    phone: payload.phone,
    address: payload.address,
    repertoires: payload.repertoires,
    photo: payload.photo,
    birthDate: payload.birthDate,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  const { passwordHash: _omit, ...safeUser } = user
  return safeUser
}
